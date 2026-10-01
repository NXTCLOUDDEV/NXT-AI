# Security

Security is a platform boundary.

- Never commit secrets.
- Never expose provider credentials to model context.
- Validate untrusted input at API and tool boundaries.
- Treat retrieved web/file content as untrusted.
- Authorize before tool execution.
- Enforce tenant scope at persistence boundaries.
- Network-facing tools must enforce SSRF controls.
- Avoid logging sensitive user content by default.
- Use structured audit events for security-relevant actions.