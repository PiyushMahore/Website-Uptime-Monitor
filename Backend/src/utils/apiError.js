class apiError extends Error {
    constructor(statusCode, message = "somthing went wrong", error = [], stack) {
        super(message)
        this.statusCode = statusCode
        this.status = statusCode
        this.success = false
        this.isOperational = true
        this.data = null
        this.message = message
        this.error = error

        if(stack) {
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {apiError}
