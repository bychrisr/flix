export const registerErrorHandler = (app) => {
  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, 'Unhandled API error');

    if (error.message === 'CORS_ORIGIN_NOT_ALLOWED') {
      reply.code(403).send({ error: 'FORBIDDEN', message: 'Origin not allowed' });
      return;
    }

    if (error.validation) {
      reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.validation,
      });
      return;
    }

    const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
    reply.code(statusCode).send({
      error: statusCode >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR',
      message: statusCode >= 500 ? 'Internal server error' : error.message,
    });
  });
};
