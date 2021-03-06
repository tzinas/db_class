import db from 'lib/db'
import logger from 'lib/logger'
import _ from 'lodash'
import dateFormat from "dateformat"
import { hidden, selectable } from 'lib/entityDetails'

import { removeUnchangableAttributes, unchangableAttributes } from 'lib/utils'

type entity ={ [key: string]: string | number }

type EntityProps = {
  entity: string
  data: entity
  db: typeof db
}

type FetchAllPros = {
  entity: string
  db: typeof db
}

const createEntity = async ({ entity, data, db }: EntityProps): Promise<void> => {
  await db`INSERT INTO ${db(entity)} ${db(removeUnchangableAttributes(data, entity))}` // e.g. INSERT INTO Organization(name, ...) VALUES(Org1, ...)
}

const fetchAll = ({ entity, db }: FetchAllPros): Promise<entity[]> => {
  return db`SELECT * FROM ${db(entity)} ORDER BY id` // e.g. SELECT * FROM Organization
}

const formatRows = (rows) => {
  return rows.map(row => _.mapValues(row, r => r instanceof Date ? dateFormat(r, "yyyy-mm-dd"):r))
}

const responses = {
  GET: async (req, res) => {
    const { entity } = req.query

    try {
      const rows = await fetchAll({ entity, db })
      logger.info(`${rows.length} ${entity}s fetched successfully`)
      return res.status(200).json({
        message: `${rows.length} ${entity}s fetched succressfully`,
        rows: formatRows(rows), unchangableAttributes: unchangableAttributes.all.concat(unchangableAttributes[entity] ? unchangableAttributes[entity]:[]),
        hidden,
        selectable 
      })
    } catch (err) {
      logger.debug(`Error fetching ${entity}s:`, err)
      return res.status(500).json({ err: `Error fetching ${entity}s: ${err}` })
    }
  },
  POST: async (req, res) => {
    const { entity } = req.query

    try {
      await createEntity({ entity, data: JSON.parse(req.body), db })
      logger.info(`${entity} created`)
      return res.status(200).json({ message: `Successfully created ${entity}` })
    } catch (err) {
      logger.debug(`Error creating ${entity}:`, err)
      return res.status(500).json({ err: `Error creating ${entity}: ${err}` })
    }
  }
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
