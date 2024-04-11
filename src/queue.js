export class Queue {
  constructor() {
    this.items = []
  }
  /**
   * 
   * @returns {string}
   */
  get() {

    if (this.items.length === 0) {
      throw new QueueEmpty("Queue is empty")
    }
    const val = this.items.shift()

    return val
  }

  /**
   * 
   * @param {string} data 
   */
  post(data) {

    this.items.push(data)
  }
}


export class QueueEmpty extends Error {
  constructor(message) {
    super(message)
    this.name = "QueueEmpty"
  }
}