import db from '../../lib/db'

const responses = {
  GET: async (req, res) => {
    console.log(await db`
      select
        *
      from "Organization"
    `)
    res.status(200).json({success: true})
  }
}

export default async (req, res) => {
  try {
    responses[req.method](req, res)
  } catch {
    res.status(500).json({ err: "Error connecting." });
  }
}
