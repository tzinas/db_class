import db from 'lib/db'
import logger from 'lib/logger'
import _ from 'lodash'
import dateFormat from "dateformat"

const fetchQuery = async ({ executive, duration, fromDate, toDate, projectId, db }) => {
  if (projectId) {
    return db`
    SELECT P.project_title, R.last_name, R.first_name
    FROM Project P, Researcher R, Works_on W
    WHERE P.id=${projectId} AND W.project_id=P.id AND W.researcher_id=R.id 
    ORDER BY P.project_title, R.last_name, R.first_name
    `
  }

  return db`
    SELECT PG.program_name, PJ.project_title, PJ.id, PJ.funding_amount, PJ.starting_date, PJ.ending_date, PJ.duration
    FROM Program PG, Project PJ
    WHERE PJ.program_id=PG.id ${
      executive
        ? db`AND PJ.executive_id=${executive}`
        : db``
    } ${
      duration
        ? db`AND PJ.duration=${duration}`
        : db``
    } ${
      fromDate
        ? db`AND PJ.ending_date>${fromDate}`
        : db``
    } ${
      toDate
        ? db`AND PJ.starting_date<${toDate}`
        : db``
    }
    ORDER BY PG.program_name, PJ.project_title
  `
}

const formatRows = (rows) => {
  return rows.map(row => _.mapValues(row, r => r instanceof Date ? dateFormat(r, "yyyy-mm-dd"):r))
}

const responses = {
  GET: async (req, res) => {
    const { executive, duration, fromDate, toDate, projectId } = req.query

    try {
      const rows = await fetchQuery({ executive, duration, fromDate, toDate, projectId, db })
      logger.info(`${rows.length} query(3.1) rows fetched successfully`)
      return res.status(200).json({ message: `${rows.length} query(3.1) rows fetched successfully`, rows: formatRows(rows) })
    } catch (err) {
      logger.debug(`Error fetching query(3.1):`, err)
      return res.status(500).json({ err: `Error fetching query(3.1): ${err}` })
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
