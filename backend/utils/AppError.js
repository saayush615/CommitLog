class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message); // super(message) calls the constructor of the parent class, which is Error in this case. 
        // The Error class expects a message as its argument, so super(message) sets the error message for your custom error.

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational;

        // Capture the stack trace, excluding this constructor from it
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;