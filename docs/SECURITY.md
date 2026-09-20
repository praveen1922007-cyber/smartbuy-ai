# Security Notes

Recommendations before production deployment:

- Secrets: store DB credentials, JWT secret, API keys in AWS Secrets Manager or similar. Do not commit `.env` files.
- TLS: enforce HTTPS via ALB or Nginx; redirect HTTP -> HTTPS.
- Input validation: ensure server-side validation for all inputs (already included in controllers) and sanitize outputs to prevent XSS.
- Rate limiting: add rate limiting middleware (e.g., `express-rate-limit`) to protect public endpoints.
- Authentication: integrate AWS Cognito or a robust identity provider for user management and social login.
- Logging & Audit: publish logs to CloudWatch or a central logging system and enable audit trails for admin actions.
- Dependency scanning: run Snyk/Dependabot to detect vulnerable packages.
