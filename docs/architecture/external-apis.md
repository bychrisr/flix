# External APIs
- Initial mandatory external API: Gemini API for AI-assisted event logo generation.
- Integration must be isolated behind an internal `branding` service adapter in `services/api` to avoid coupling domain flows directly to provider SDK details.
- Baseline controls for this integration:
  - timeout, retry with backoff, and explicit failure surface to admin UI;
  - prompt template versioning for reproducible outputs;
  - cost/usage logging per request for operational visibility.
