# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spanish Wordle game built as a DevOps portfolio project. The application has two independently deployable components:

- **Frontend** (`front/`): React + Vite SPA, deployed to S3 + CloudFront as static assets under the `/wordle/` path
- **Backend** (`backend/`): Python Flask API, deployed as AWS Lambda via the Serverless Framework, exposed through API Gateway

## Commands

### Frontend (`front/`)

```bash
npm run dev        # Start Vite dev server (uses .env.local → http://localhost:8080 backend)
npm run build      # Build for production (uses .env.production)
npm run build -- --mode development   # Build for dev stage
npm run lint       # ESLint (zero-warnings mode)
npm run preview    # Preview the production build locally
```

### Backend (`backend/`)

```bash
python server.py                              # Run Flask locally on port 8080
pip install -r requirements.txt               # Install Python deps

npm install                                   # Install Serverless Framework
npx serverless deploy --stage dev             # Deploy to dev
npx serverless deploy --stage prod            # Deploy to prod
```

## Architecture

### Request Flow

```
Browser → CloudFront → S3 (static React app)
                ↓ (HTTPS API calls)
         API Gateway → Lambda → Flask (app.py game logic)
                                    ↓
                               DynamoDB (wordle_words table)
                               [falls back to data.py word list]
```

### Backend Structure

The backend uses a **custom Lambda handler** (`app/handler.py`) instead of Mangum to convert API Gateway HTTP events into WSGI-compatible requests for Flask. The entry point chain is:

`handler.handler` → `handler.py` (Lambda event adapter) → `flask_app.py` (Flask WSGI app) → `app.py` (game logic) → `word_service.py` (DynamoDB)

The single API endpoint is `POST /api/guess`, which receives a guess and returns letter-level feedback.

### Frontend Environment Variables

Vite injects `VITE_API_BASE_URL` at build time from:
- `.env.local` — local dev (`http://localhost:8080`)
- `.env.development` — dev stage (dev API Gateway URL)
- `.env.production` — prod stage (prod API Gateway URL)

No `.env` files are needed at runtime since the frontend is static.

### DynamoDB

The words table (`wordle_words`) is queried via a GSI (`word-index`). If DynamoDB is unavailable or `STAGE` is not set, the app falls back to the local word list in `data.py`.

## CI/CD & Versioning

Three GitHub Actions workflows:

- **`backend-deploy.yml`**: Triggers on pushes to `main`/`develop` under `backend/**`. Deploys to `prod` on releases, `dev` otherwise.
- **`frontend-deploy.yml`**: Triggers on pushes to `develop` or GitHub releases. Builds and syncs to S3, then invalidates the CloudFront distribution.
- **`auto-tag.yml`**: Triggers on push to `main`. Reads `VERSION`, parses commit messages for semver intent (`BREAKING CHANGE` → major, `feat:` → minor, `fix:` → patch), bumps the file, commits, tags, and creates a GitHub Release.

Secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, bucket names, CloudFront distribution IDs) are stored in GitHub Actions Secrets — never committed.

## Roadmap: DevOps Hardening Plan

A detailed, phased plan to harden this project as a DevOps portfolio lives at `~/.claude/plans/shimmying-bubbling-kay.md`. Implementation is incremental — one phase at a time, validating each before moving on.

**Key decisions already made:**
- **Unified vocabulary**: `dev` / `prod` across backend, frontend, workflows, and env files (today there is a mix with `development` / `production`).
- **Git flow**: `develop` → automatic dev environment; `main` → prod environment (via PR from develop). Nothing is committed directly to main.
- **Versioning**: `VERSION` is the source of truth. It is shown in the frontend footer and exposed via `GET /api/version` in the backend.
- **Per-phase testing**: each phase brings its own testing tools (actionlint/act, bats-core, pytest+moto, vitest+MSW+Playwright, tflint+checkov+terratest).

**Phases (in order):**
1. Unify environments and fix workflows (`dev` / `prod`, fix triggers, GitHub Environments).
2. Working versioning (fix auto-tag, inject VERSION into front and back, testable bump script).
3. CI validation (new `ci.yml` with lint + tests + SAST as a gate before deploy).
4. Backend quality (Pydantic, error handlers, structured logging, CORS per stage, pytest).
5. Frontend quality (loading states, error handling, widget via env vars, vitest + Playwright).
6. IaC (Terraform for S3/CloudFront) + observability (CloudWatch alarms, custom metrics, runbook).

**When working in this repo**: before proposing changes, check the plan to locate the relevant phase and respect the decisions already made. The plan is not set in stone — it can be adjusted, but not ignored.
