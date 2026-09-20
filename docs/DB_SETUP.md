# Database Setup (MongoDB)

Local development

1. Run a local MongoDB (Docker):

```bash
docker run -d -p 27017:27017 --name smartbuy-mongo mongo:6
```

2. Set `MONGODB_URI` in `backend/.env` if necessary, e.g.
```
MONGODB_URI=mongodb://127.0.0.1:27017/smartbuy
```

MongoDB Atlas (production)

1. Create a cluster on MongoDB Atlas.
2. Create a database user and network whitelist.
3. Copy the connection string and store it securely (Secrets Manager / GitHub Secrets) as `MONGODB_URI`.

Indexes and Geo queries
- The `Store` model includes a `2dsphere` index on `location` for proximity queries. Ensure `location.coordinates` are stored as `[lon, lat]`.

Backups
- Use MongoDB Atlas automated backups, or run scheduled `mongodump` to S3 for self-managed deployments.
