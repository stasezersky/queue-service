
/**
 * 
 * @param {string} queueName 
 * @returns 
 */
export function validateGet(queueName) {
    if (queueName) {
        return true
    }
    return false

}
/**
 * 
 * @param {string} queueName 
 * @param {object} data 
 * @param {number} MAX_PAYLOAD_SIZE 
 * @returns 
 */
export function validatePost(queueName, data) {
    if (!queueName) {
        return { status: 400, error: "Queue name is required" }
    }

    if (!data || typeof data !== "object") {
        return { status: 400, error: "Invalid data format" }
    }
}