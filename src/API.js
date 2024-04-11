import { QueueManager } from "./queue-manager.js";




const DATA_EMPTY = "data sent is empty"

class API {
    constructor(queueManager) {
        this.queueManager = queueManager
    }

    /**
     * 
     * @param {string} queueName 
     * @param {JSON} data 
     * @returns {void}
     */
    post(queueName, data) {

        const serializedData = JSON.stringify(data)
        const result = this.queueManager.post(queueName, serializedData)
        return { success: result }

    }
    /**
     * 
     * @param {string} queueName 
     * @returns {string}
     */
    get(queueName) {

        const val = this.queueManager.get(queueName)
        return val

    }
}

const qm = new QueueManager()
export const api = new API(qm)
