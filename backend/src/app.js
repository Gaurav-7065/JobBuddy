import express from 'express'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import interviewRouter from './routes/interview.route.js'

import cors from 'cors';
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: import.meta.env.VITE_CLIENT_URL,
    credentials: true
}));

app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter)

export default app