import express from "express"
import { api } from "./API.js"
import { validateGet, validatePost } from "./validators.js"
import { QueueEmpty } from "./queue.js"
import { QueueError } from "./queue-manager.js"


const PORT = process.env.PORT || 3000
const MAX_PAYLOAD_SIZE = process.env.MAX_PAYLOAD_SIZE || "100kb"
const DEFAULT_TIMEOUT = process.env.DEFAULT_TIMEOUT || 10000
const QUEUE_ERROR = "Queue Problem - please try later"


const app = express()
// using json parser for the body and setting max payload size
app.use(express.json({ limit: MAX_PAYLOAD_SIZE }))






app.post("/api/:queueName", (req, res) => {
    const queueName = req.params.queueName
    const { data } = req.body
    // TODO add size validation
    const validationObj = validatePost(queueName, data)
    if (validationObj) {
        return res.status(validationObj.status).json({ error: validationObj.error })
    }

    const result = api.post(queueName, data)

    if (result.error) {
        return res.status(500).json({ error: result.error })
    }

    res.json({ success: result.success })
})


app.get("/api/:queueName", (req, res) => {
    const { queueName } = req.params
    const timeout = req.query.timeout || DEFAULT_TIMEOUT

    if (!validateGet(queueName)) {
        return res.status(400).json({ error: "please provide queue name in the route /api/:queueName" })
    }

    const dataPromise = new Promise((resolve) => {
        try {
            const result = api.get(queueName)
            res.json({ data: result })
        } catch (error) {
            if (error instanceof QueueEmpty) {
                res.status(204).send()
            } else if (error instanceof QueueError) {
                res.status(503).json({ error: QUEUE_ERROR })
            }

        }
        resolve()
    })

    const racePromise = new Promise((resolve) => {
        setTimeout(() => {
            res.status(408).send("timeout")
            resolve()
        }, timeout)
    })
    Promise.race([dataPromise, racePromise])

})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})