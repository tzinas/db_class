import db from 'lib/db'
import logger from 'lib/logger'
import _ from 'lodash'
import dateFormat from "dateformat"

const ACCEPTED_QUERIES = {
  3.21: {
    query: (db) => {
      return db`SELECT * FROM researchers_projects`
    }
  },
  3.22: {
    query: (db) => {
      return db`SELECT * FROM projects_per_rescenter`
    }
  },
  3.4: {
    title: "3.4",
    description: "Organizations with same number of projects 2 years in a row with more than 10 projects each of those years",
    query: (db) => {
      return db`
        WITH Q AS (
          SELECT O.id as org_id, EXTRACT (YEAR FROM P.starting_date) as year, count(*) AS number_of_projects
          FROM Organization O, Project P
          WHERE P.organization_id=O.id 
          GROUP BY O.id, year
        )
        SELECT DISTINCT O.name, least(Q1.year, Q2.year) AS year1, greatest(Q1.year, Q2.year) AS year2, Q1.number_of_projects
        FROM Q AS Q1, Q AS Q2, Organization O
        WHERE O.id=Q1.org_id AND Q1.org_id=Q2.org_id AND Q1.number_of_projects=Q2.number_of_projects AND ((Q1.year=Q2.year-1) OR (Q2.year=Q1.year-1)) AND Q1.number_of_projects>=10
        ORDER BY O.name
      `
    }
  },
  3.5: {
    title: "3.5",
    description: "Scientific fields that share most projects",
    query: (db) => {
      return db`
        WITH Q AS (
          SELECT C1.scientific_id as id1, C2.scientific_id as id2, C1.project_id
          FROM Concerns C1, Concerns C2
          WHERE C1.project_id=C2.project_id AND C1.scientific_id<>C2.scientific_id)
        SELECT S1.field_name as field_name1, S2.field_name as field_name2, f.number_of_projects
        FROM 	(SELECT DISTINCT least(sid1, sid2) AS sid1, greatest(sid1, sid2) AS sid2, allmax.times as number_of_projects
          FROM 	(SELECT Q.id1 as sid1, Q.id2 as sid2, count(*) as times
            FROM Q
            GROUP BY (Q.id1, Q.id2)) AS allmax ORDER BY allmax.times DESC) AS F, Scientific_field S1, Scientific_field S2
        WHERE S2.id=F.sid2 AND S1.id=F.sid1
        LIMIT 3
      `
    }
  },
  3.6: {
    title: "3.6",
    description: "Young researchers working on most projects",
    query: (db) => {
      const currentDate = new Date()

      return db`
        WITH active_projects AS (
          SELECT id
          FROM Project
          WHERE ending_date>${dateFormat(currentDate, "yyyy-mm-dd")}),
          
          young_researchers AS (
          SELECT R.id as ID, R.last_name, R.first_name, count(*) as number_of_projects, ROUND(CAST(${dateFormat(currentDate, "yyyy-mm-dd")}-R.date_of_birth AS DECIMAL) / 365) as age
          FROM Researcher R, Project P, Works_on W
          WHERE R.id=W.researcher_id AND W.project_id=P.id AND (P.id IN (SELECT * FROM active_projects)) AND ROUND(CAST(${dateFormat(currentDate, "yyyy-mm-dd")}-R.date_of_birth AS DECIMAL) / 365) < 40
          GROUP BY R.id)
        (SELECT R.last_name, R.first_name, Q.number_of_projects, Q.age
        FROM Researcher R, young_researchers Q
        WHERE R.id=Q.ID)
        EXCEPT
        (SELECT R.last_name, R.first_name, Q1.number_of_projects, Q1.age
        FROM Researcher R, young_researchers Q1, young_researchers Q2
        WHERE Q1.number_of_projects < Q2.number_of_projects AND R.id=Q1.ID)
      `
    }
  },
  3.7: {
    title: "3.7",
    description: "Executives that have donated the highest amount of money to a company",
    query: (db) => {
      return db`
        SELECT E.last_name, E.first_name, O.name as company_name, Q.sum as amount
        FROM	(SELECT DISTINCT ON (E.id) E.id AS ex_id, C.id AS comp_id, sum(P.funding_amount)
            FROM Executive E, Company C, Project P
            WHERE E.id=P.executive_id AND P.organization_id=C.organization_id
            GROUP BY E.id, C.id
            ORDER BY E.id, sum DESC) AS Q, Executive E, Organization O
        WHERE E.id=Q.ex_id AND O.id=(SELECT organization_id FROM Company WHERE id=Q.comp_id)
        ORDER BY Q.sum DESC
        LIMIT 5
      `
    }
  },
  3.8: {
    title: "3.8",
    description: "Researchers working on 5 or more  projects without deliverable",
    query: (db) => {
      return db`
        SELECT R.last_name, R.first_name, Q.number_of_projects
        FROM   Researcher R,	(SELECT R.id AS id, count(DISTINCT P.id) AS number_of_projects
              FROM Researcher R, Project P, Deliverable D, Works_on W
              WHERE R.id=W.researcher_id AND W.project_id=P.id AND (P.id NOT IN (SELECT project_id FROM Deliverable))
              GROUP BY R.id
              HAVING count(DISTINCT P.id) >= 5) AS Q
        WHERE R.id=Q.id
      `
    }
  }
}

const fetchQuery = async ({ query, db }) => {
  return ACCEPTED_QUERIES[query].query(db)
}

const responses = {
  GET: async (req, res) => {
    const { query } = req.query

    try {
      const rows = await fetchQuery({ query, db })
      logger.info(`${rows.length} query(${query}) rows fetched successfully`)
      return res.status(200).json({ message: `${rows.length} query(${query}) rows fetched successfully`, rows: rows, title: ACCEPTED_QUERIES[query].title, description: ACCEPTED_QUERIES[query].description })
    } catch (err) {
      logger.debug(`Error fetching query(${query}):`, err)
      return res.status(500).json({ err: `Error fetching query(${query}): ${err}` })
    }
  },
}

export default async (req, res) => {
  logger.info(`${req.url} - [${req.method}]`)

  const { query } = req.query

  if (!(query in ACCEPTED_QUERIES)) {
    logger.debug(`Query ${query} is not supported`)
    return res.status(400).json({ err: `Query ${query} is not supported` })
  }

  if (!(req.method in responses)) {
    logger.debug(`Method ${req.method} is not supported`)
    return res.status(405).json({ err: `Method ${req.method} is not supported` })
  }

  try {
    await responses[req.method](req, res)
  } catch (err) {
    logger.warn(`Internal error: `, err)
    return res.status(500).json({ err: "Internal error" })
  }
}
