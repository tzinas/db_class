import db from 'lib/db'
import logger from 'lib/logger'
import _ from 'lodash'

type entity ={ [key: string]: string | number }

type UpdateEntityProps = {
  entity: string
  id: number
  data: entity
  db: typeof db
}

type DeleteEntityProps = {
  entity: string
  id: number
  db: typeof db
}

const updateEntity = async ({ entity, id, data, db }: UpdateEntityProps): Promise<void> => {
  await db`UPDATE ${db(entity)} SET ${db(data)} WHERE id = ${id}`
}

const deleteEntity = async ({ entity, id, db }: DeleteEntityProps): Promise<void> => {
  await db`DELETE FROM ${db(entity)} WHERE id=${id}`
}

const responses = {
  DELETE: async (req, res) => {
    const { entity, id } = req.query

    try {
      await deleteEntity({ entity, id, db })
      logger.info(`${entity} with id=${id} deleted`, req.body)
      return res.status(200).json({ message: `${entity} with id=${id} deleted` })
    } catch (err) {
      logger.debug(`Error deleting ${entity}:`, err)
      return res.status(500).json({ err: `Error deleting ${entity}` })
    }
  },
  PUT: async (req, res) => {
    const { entity, id } = req.query

    console.log(entity, id)
    try {
      await updateEntity({ entity, id, data: JSON.parse(req.body), db })
      logger.info(`${entity} with id = ${id} updated`)
      return res.status(200).json({ message: `Successfully updated ${entity}` })
    } catch (err) {
      logger.debug(`Error updating ${entity}:`, err)
      return res.status(500).json({ err: `Error updating ${entity}` })
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
