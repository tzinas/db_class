import db from 'lib/db'
import logger from 'lib/logger'

type createEntityProps = {
  entity: string
  data: { [key: string]: string | number}
  db: typeof db
}

const createEntity = async ({ entity, data, db }: createEntityProps) => {
  await db`INSERT INTO ${db(entity)} ${db(data)}`
}

const responses = {
  POST: async (req, res) => {
    const { entity } = req.query

    try {
      await createEntity({ entity, data: req.body, db })
      logger.info(`${entity} created`)
      return res.status(200).json({ message: `Successfully created ${entity}` })
    } catch (err) {
      logger.debug(`Error creating ${entity}:`, err)
      return res.status(500).json({ err: `Error creating ${entity}` })
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
