const buildContext = (request, context = {}) => ({
  requestId: request.id,
  method: request.method,
  route: request.routerPath ?? request.url,
  ...context,
});

export const createObservabilityService = ({ onEvent, onKpiHook } = {}) => {
  const emitEvent = (request, eventName, context = {}) => {
    const payload = {
      eventName,
      eventType: 'operational',
      ...buildContext(request, context),
    };
    request.log.info(payload, `observability:event:${eventName}`);
    onEvent?.(payload);
    return payload;
  };

  const emitKpiHook = (request, hookName, context = {}) => {
    const payload = {
      hookName,
      eventType: 'kpi_hook',
      ...buildContext(request, context),
    };
    request.log.info(payload, `observability:kpi:${hookName}`);
    onKpiHook?.(payload);
    return payload;
  };

  return {
    emitEvent,
    emitKpiHook,
  };
};
