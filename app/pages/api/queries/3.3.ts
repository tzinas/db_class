import db from 'lib/db'
import logger from 'lib/logger'
import _ from 'lodash'
import dateFormat from "dateformat"

const fetchQuery = async ({ id, db }) => {
  const currentDate = new Date()
  const oneYearAgo = currentDate.setFullYear(currentDate.getFullYear()-1);


  return db`
    WITH year_active_projects AS (
      SELECT id
      FROM Project
      WHERE ending_date>${dateFormat(currentDate, "yyyy-mm-dd")} AND starting_date<(${dateFormat(oneYearAgo, "yyyy-mm-dd")}))
    SELECT P.project_title, R.last_name, R.first_name
    FROM Project P, Scientific_field S, Concerns C, Researcher R, Works_on W
    WHERE S.id=${id} AND S.id=C.scientific_id AND P.id=C.project_id AND (P.id IN (SELECT * FROM year_active_projects)) AND R.id=W.researcher_id AND W.project_id=P.id
  `
}

const responses = {
  GET: async (req, res) => {
    const { id } = req.query

    try {
      const rows = await fetchQuery({ id, db })
      logger.info(`${rows.length} query(3.3) rows fetched successfully`)
      return res.status(200).json({ message: `${rows.length} query(3.3) rows fetched successfully`, rows: rows })
    } catch (err) {
      logger.debug(`Error fetching query(3.3):`, err)
      return res.status(500).json({ err: `Error fetching query(3.3): ${err}` })
    }
  },
}

export default async (req, res) => {
  logger.info(`${req.url} - [${req.method}]`)

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
