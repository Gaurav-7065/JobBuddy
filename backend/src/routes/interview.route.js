import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/file.middleware.js';
const interviewRouter=express.Router();
import {interviewController}   from "../controllers/interview.controller.js"

/**
 * @route post/api/interview
 * @description generate interview report on the basis of user self description,resume and job description
 * @access private
 */

interviewRouter.post('/',authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController
)

/**
 * @route get/api/interview/report/interviewId
 * @description get specific interview report using interviewId
 * @access private
 */

interviewRouter.get('/report/:interviewId',authMiddleware.authUser,upload.single("resume"),interviewController.getInterviewReportController
)

/**
 * @route get/api/interview/
 * @description get all the interviews of that user
 * @access private
 */

interviewRouter.get('/',authMiddleware.authUser,interviewController.getAllInterviewController);

/**
 * @route GET/api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description,resume and job description
 * @access private
 */

interviewRouter.get('/resume/pdf/:interviewReportId',authMiddleware.authUser,interviewController.generateResumePdfController);
export default interviewRouter;