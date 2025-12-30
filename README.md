# Wordle ES – DevOps Portfolio Project

This project is part of my **DevOps portfolio** and focuses on designing, deploying, and debugging a real-world **CI/CD-ready cloud architecture** using AWS and GitHub Actions.

The application is a Spanish Wordle game composed of:
- A **React + Vite frontend** deployed as a static website
- A **Python Flask backend** deployed as a serverless API

The main goal of this project is **learning and showcasing DevOps practices**, not just making the app work.

---

## 🧱 Architecture (Current State)

User
↓
Browser
↓
AWS S3 (Static Website Hosting)
↓
React + Vite Frontend
↓
HTTPS
↓
AWS API Gateway (REST)
↓
AWS Lambda (Python 3.10)
↓
Flask API (Game logic)

---

## 🛠 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Static website hosted on AWS S3

### Backend
- Python 3.10
- Flask (WSGI)
- AWS Lambda
- AWS API Gateway (REST)

### DevOps / Cloud
- AWS S3 (Static Website Hosting)
- AWS Lambda
- AWS API Gateway
- Serverless Framework
- GitHub (CI/CD pipelines in progress)

---

## 🔍 Key DevOps Decisions

### Static Frontend Deployment
The frontend is deployed as a static website to:
- Reduce operational complexity
- Minimize cost
- Improve scalability and performance
- Decouple frontend and backend deployments

This architecture fits perfectly with S3-based static hosting and CI/CD pipelines.

---

### Flask without Mangum
Flask is a **WSGI** framework, not ASGI.

Instead of using Mangum (an ASGI adapter), the backend uses a **custom Lambda handler** to:
- Maintain full control over the request lifecycle
- Avoid runtime incompatibilities
- Simplify debugging in AWS Lambda environments
- Better understand how API Gateway events are handled

This approach closely reflects how many production Flask APIs are deployed in serverless environments.

---

## 🚀 Backend Deployment Flow

1. Flask application is packaged using Serverless Framework
2. Deployed to AWS Lambda (Python 3.10 runtime)
3. Exposed via AWS API Gateway (REST)
4. Frontend communicates with the backend via HTTPS

---

## 🧪 Validation & Debugging

- Backend tested using `curl`
- CloudWatch Logs used extensively for debugging
- End-to-end flow validated:
  - API Gateway → Lambda → Flask → Game logic

Several real-world issues were identified and fixed during deployment, including:
- Runtime import errors
- Packaging issues
- API Gateway integration mismatches

---

## 📌 Current Status

✅ Frontend served from AWS S3  
✅ Backend deployed and responding correctly  
🚧 CI/CD pipelines using GitHub Actions — **in progress**  
🚧 Custom domain integration — **pending**

---

## 🧠 Learning Objectives

- Design and implement CI/CD pipelines using GitHub Actions
- Apply Infrastructure as Code concepts
- Manage secrets securely
- Separate environments (dev / prod)
- Document and explain cloud architectures clearly
- Debug real serverless runtime issues

---

## 🔜 Next Steps

- Connect frontend to the production API endpoint
- Automate frontend deployment to S3 using GitHub Actions
- Automate backend deployment using GitHub Actions
- Introduce environment separation
- Improve logging and observability