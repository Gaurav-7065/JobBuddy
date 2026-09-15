import {PDFParse} from 'pdf-parse'
import interviewReportModel from '../models/interviewReport.model.js';
import generateInterviewReport,{generateResumePdf} from '../services/ai.services.js';
async function generateInterviewReportController(req, res) {

    
    const resumeContent = await new PDFParse({
        data:req.file.buffer
    }).getText();
    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })
   
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        message:"Interview report generated successfully",
        interviewReport
    })

}

async function getInterviewReportController(req,res) {
    const { interviewId }=req.params

    const interviewReport=await interviewReportModel.findOne({_id:interviewId,user:req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message:"Interviw report not found"
        })
    }

    res.status(200).json({
        message:"Interview report fetched successfully",
        interviewReport
    })

    
}

async function getAllInterviewController(req,res) {

    const interviewReports=await interviewReportModel
        .find({user:req.user.id})
        .sort({createdAt:-1})
        .select("title matchScore createdAt")

    res.status(200).json({
        message:"Interview reports fetched succesfully.",
        interviewReports
    })
}

async function generateResumePdfController(req,res) {
    const {interviewReportId}=req.params;
    const interviewReport=await interviewReportModel.findOne({_id:interviewReportId,user:req.user.id})
    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }
    const {resume,selfDescription,jobDescription}=interviewReport;
    const pdfBuffer=await generateResumePdf({resume,selfDescription,jobDescription});
    res.set({
        'Content-Type':'application/pdf',
        'Content-Disposition':`attachment; filename=interview_report_${interviewReportId}.pdf`,
        'Content-Length':pdfBuffer.length
    })
    res.send(pdfBuffer);
}


export const interviewController = {

    generateInterviewReportController,
    getInterviewReportController,
    getAllInterviewController,
    generateResumePdfController

}