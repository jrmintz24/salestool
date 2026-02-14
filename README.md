# AI Pipeline Copilot (v0.1)

Next.js 14 + Clerk + Prisma + OpenAI implementation for an enterprise sales copilot.

## Setup

1. `cp .env.example .env`
2. Fill env vars
3. `npm install`
4. `npx prisma migrate dev --name init`
5. `npm run dev`

## Implemented scopes

- Clerk auth + route protection
- User-scoped Prisma models (accounts, activities, artifacts, tasks, settings, event logs)
- Dashboard account prioritization and task checklist
- Accounts CRUD and account detail page with artifact/activity views
- AI endpoints for account brief, outreach pack, and follow-up using OpenAI Responses API
- Task generation endpoints (daily and per account)
- Prompt files in `/prompts`
