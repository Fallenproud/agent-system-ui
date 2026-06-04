# Deploy to Render

## Option A: One-Click Blueprint (Recommended)

1. Push this repo to GitHub
2. Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)
3. Click **New Blueprint Instance**
4. Connect your GitHub repo
5. Render will automatically:
   - Build the Docker image
   - Provision a free PostgreSQL database
   - Deploy the web service
   - Wire `DATABASE_URL` and `JWT_SECRET`

## Option B: Manual Web Service + DB

### 1. Create PostgreSQL Database
- Dashboard → **New** → **PostgreSQL**
- Name: `agent-system-db`
- Plan: **Free**
- Create Database

### 2. Create Web Service
- Dashboard → **New** → **Web Service**
- Connect your GitHub repo
- Runtime: **Docker**
- Plan: **Free**
- Set environment variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | *(copy from your Postgres dashboard)* |
| `JWT_SECRET` | *(generate a strong random string, 32+ chars)* |
| `NODE_ENV` | `production` |
| `USE_MOCK` | `true` *(set to `false` if Kimi CLI is available)* |
| `PORT` | `3001` |

- Health Check Path: `/api/health`
- Create Web Service

### 3. Verify Deployment

```bash
curl https://<your-service>.onrender.com/api/health
# Expected: {"status":"ok","kimi":false,"auth":true}
```

## Post-Deploy Checklist

- [ ] Visit the web URL and register a test account
- [ ] Confirm chat streaming works
- [ ] Confirm agent cards load
- [ ] Confirm workflow designer opens
- [ ] Set `CORS_ORIGIN` if you need to restrict API access to a specific frontend domain

## Switching from Mock to Live Kimi

1. Install Kimi CLI v1.5 on your deployment host (not available on Render free tier)
2. Set `USE_MOCK=false`
3. Ensure `kimi` binary is in `$PATH`

> **Note:** Render free tier does not support installing the Kimi CLI. Keep `USE_MOCK=true` for free hosting, or switch to a VPS (DigitalOcean, Hetzner) for live Kimi integration.
