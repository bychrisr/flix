import { z } from 'zod';
import { authenticateAdmin } from '../services/admin-service.js';
import { signAccessToken } from '../services/token-service.js';

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const registerAdminAuthRoutes = async (app, { observabilityService } = {}) => {
  app.post('/api/admin/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Invalid login payload',
        details: parsed.error.flatten(),
        requestId: request.id,
      });
    }

    const admin = await authenticateAdmin(parsed.data);
    if (!admin) {
      observabilityService?.emitEvent(request, 'admin_auth_failed', {
        username: parsed.data.username,
        reason: 'invalid_credentials',
      });
      observabilityService?.emitKpiHook(request, 'kpi_auth_login', {
        success: false,
      });
      return reply.code(401).send({
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password',
      });
    }

    const accessToken = signAccessToken({ sub: admin.id, username: admin.username, role: 'admin' });
    observabilityService?.emitEvent(request, 'admin_auth_succeeded', {
      adminId: admin.id,
      username: admin.username,
    });
    observabilityService?.emitKpiHook(request, 'kpi_auth_login', {
      success: true,
    });

    return reply.send({
      accessToken,
      tokenType: 'Bearer',
      user: { id: admin.id, username: admin.username },
    });
  });
};
