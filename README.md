# JobBuddy

> Your AI-powered interview and career preparation companion.

JobBuddy helps candidates prepare for a specific job instead of relying on generic interview advice. Upload a job description and resume, or provide a self-description, and JobBuddy creates a personalized preparation workspace for you.

## What It Does

- Analyzes how well your profile matches a job description
- Generates role-specific technical interview questions with suggested answers and interviewer intent
- Generates behavioral interview questions with suggested answers
- Identifies skill gaps and highlights weak topics by severity
- Creates a day-by-day interview preparation roadmap
- Generates a resume tailored to the target job description as a PDF
- Saves interview reports so you can revisit your preparation later

## Suggested Project Name

**JobBuddy** is a strong name for this project because it is simple, memorable, and communicates that the product acts as a practical companion throughout the job search and interview process.

Other possible names:

- PrepPilot
- CareerCraft AI
- InterviewMap
- HireReady
- RoleReady

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication with HTTP-only cookies
- Google Gemini through `@google/genai`
- Multer for resume uploads
- Puppeteer for PDF resume generation
- Zod for validating AI-generated reports

## Project Structure

```text
JobBuddy/
├── backend/
│   ├── server.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
└── frontend/
    └── src/
        ├── features/
        │   ├── auth/
        │   └── Interview/
        └── App.jsx
```

## Requirements

- Node.js 20 or newer
- npm
- A MongoDB database, local or hosted
- A Google Gemini API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Gaurav-7065/JobBuddy.git
cd JobBuddy
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## API Overview

All interview routes require an authenticated user.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Log in |
| `GET` | `/api/auth/get-me` | Get the current user |
| `GET` | `/api/auth/logout` | Log out |
| `POST` | `/api/interview` | Generate an interview report from a job description, resume, and/or self-description |
| `GET` | `/api/interview` | Get all saved interview reports |
| `GET` | `/api/interview/report/:interviewId` | Get one interview report |
| `GET` | `/api/interview/resume/pdf/:interviewReportId` | Generate a tailored resume PDF |

The interview generation endpoint accepts the resume as a multipart file field named `resume`.

## Generated Report

Each report can include:

- Job match score from 0 to 100
- Technical questions and suggested answers
- Behavioral questions and suggested answers
- Skill gaps marked as low, medium, or high severity
- A preparation plan covering multiple days
- The target role title

## Available Scripts

### Backend

```bash
npm run dev       # Start the backend with Nodemon
```

### Frontend

```bash
npm run dev      # Start the Vite development server
npm run build    # Build the production frontend
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

## Security Notes

- Keep `.env` files private and never commit API keys or database credentials.
- Resume files may contain personal information. Use a trusted MongoDB and deployment provider.
- Configure the allowed frontend origin in the backend CORS settings before deploying.

## Roadmap

- Add progress tracking for preparation plans
- Add interview practice sessions with answer feedback
- Add support for more resume file formats
- Add job application tracking
- Add export options for interview reports
- Add analytics for skill improvement over time

## License

This project is currently not licensed. Add a license before distributing or accepting external contributions.
