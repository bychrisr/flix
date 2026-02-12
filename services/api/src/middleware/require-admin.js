import { verifyAccessToken } from '../services/token-service.js';

export const requireAdmin = async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'UNAUTHORIZED', message: 'Missing bearer token' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const payload = verifyAccessToken(token);
    if (payload?.role !== 'admin') {
      return reply.code(403).send({ error: 'FORBIDDEN', message: 'Admin role required' });
    }
    request.admin = payload;
  } catch {
    return reply.code(401).send({ error: 'UNAUTHORIZED', message: 'Invalid or expired token' });
  }
};
