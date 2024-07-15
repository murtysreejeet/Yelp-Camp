class ExpressError extends Error {
    construction (message, statusCode){
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;