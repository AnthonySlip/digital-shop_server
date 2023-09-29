class apiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
    static BadRequest (message) {
        return new apiError(400, message)
    }
    static Unauthorized (message) {
        return new apiError(401, message)
    }
    static Forbidden (message) {
        return new apiError(403, message)
    }
    static NotFound (message) {
        return new apiError(404, message)
    }
    static TooManyRequests (message) {
        return new apiError(429, message)
    }
    static BadGateway (message) {
        return new apiError(502, message)
    }
    static GatewayTimeout (message) {
        return new apiError(503, message)
    }
}

module.exports =  apiError