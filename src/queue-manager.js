import { Queue } from "./queue.js"


export class QueueManager {
    constructor() {
        this.queues = {}
    }

    /**
     * 
     * @param {string} queueName 
     * @param {string} data 
     * @returns {void}
     */
    post(queueName, data) {
        // in case we want to move to some external queue
        try {
            if (!this.queues[queueName]) {
                this.queues[queueName] = new Queue()
            }

            this.queues[queueName].post(data)
            return true
        } catch (error) {
            console.log(error)
            throw new QueueError("Queue internal issue")
        }
    }

    /**
     * 
     * @param {string} queueName 
     * @returns {string}
     */
    get(queueName) {


        if (!this.queues[queueName]) {
            throw new QueueError("Queue internal issue")
        }
        const val = this.queues[queueName].get()
        return val
    }
}


export class QueueError extends Error {
    constructor(message) {
        super(message)
        this.name = "QueueError"
    }
}