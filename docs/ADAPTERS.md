# Marketplace Adapters (Real integrations)

This document explains how to replace the built-in mock adapters with real marketplace integrations and how to securely provide API keys.

Supported marketplace integrations (suggested)
- Amazon Product Advertising API (PA-API)
- Flipkart Seller API / Affiliate API
- Blinkit / Grofers partner APIs (if available)
- Meesho seller APIs

Important notes
- Marketplaces often require developer registration, API keys, and strict usage terms. Ensure you review TOS before scraping or using private APIs.
- For production, store credentials in AWS Secrets Manager or another secrets store — do NOT commit keys.

How to wire adapters

1. Create a secret per vendor in Secrets Manager (or set env vars for local dev):

Example secret JSON for Amazon PA-API:

```json
{
  "accessKeyId": "AKIA...",
  "secretAccessKey": "...",
  "partnerTag": "your-tag",
  "region": "us-east-1"
}
```

2. Set `USE_AWS_SECRETS=true` and `AWS_SECRET_NAME_<VENDOR>=your-secret-name` or set env vars `AMAZON_ACCESS_KEY`, `AMAZON_SECRET`, etc.

3. Implement adapter classes under `backend/src/services/marketplace/real/` and register them in `aggregator.service.ts`.

Security
- Use IAM roles for ECS tasks to allow Secrets Manager access.
- Rotate keys regularly and monitor usage.

Legal
- Do not scrape marketplaces without permission. Prefer official partner or affiliate APIs.
