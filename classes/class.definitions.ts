const HTTP = {

    RESPONSE: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        FOUND: 302,
        UNAUTHORIZED: 401,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500,
        SERVICE_UNAVAILABLE: 503
    }
}

type HTTP_METHOD = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

export { HTTP, HTTP_METHOD };