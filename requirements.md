You are required to implement a running backend server, exposing a REST API for managing queues of messages.

The REST API:


`POST /api/{queue_name}`
 
The body is the message in JSON format.
This will place a new message in the queue named queue_name.

`GET /api/{queue_name}?timeout={ms}`

Gets the next message from queue_name.
Will return 204 if there’s no message in the queue after the timeout has elapsed.
If a timeout is not specified, a default of 10 seconds should be used.


BONUS

Support running multiple servers on multiple machines, acting as a single logical queue.






# Design
services: `QueueManager`,  and `Server` (with `API` handler in it)

## QueueManager
holds and creates queues:
* IMPLEMENT class Queue with interface of {
    constructor,
    get() -> str, 
    post() -> void
}
* IMPLEMENT class QueueManager with interface of {
    constructor, 
    post(queue_name: str, data: str) -> true, throws Error(if no queue available - in case we want to move to some other queue instead of using the memory), 
    get(queue_name: str) ->  data: str }

* hold queues in memory object
* if post sent to non existing queue - create a queue and write the message into the queue
* if get sent to non existing queue - return 404 - not found
* if get sent to non empty queue - return 204 - no content

* post-success - return 200
* post-fail(queue is unavailable or error) - return 503

* get-success - return 200 + { data: str }
* get-fail(queue not exists) - 404
* get-fail(queue is empty) - 204 
* get(queue is unavailable or error) - 503

## Server
manages requests:
* param validation for get and post:
    * get: path: {dynamic queue_name} ,qs {timeout: not-mandatory} 
        * timeout not found? fallback to 10*1000ms from env
    * post:  path: {dynamic queue_name}, body {data: json, size }
        * size is too big? 413 - payload too large
        * data not in json? 400 - bad request
* calls the `API`:
    * post
        * 200: continue
        * 503: log error and return 503 with `queue problem please try later`

    * get
        * 200: return 200 with data
        * 204: return 204 with `empty queue`
        * 404: return 404 with `queue doesn't exists`
        * 503: log error and return 503 with `queue problem please try later`
