import { getAllInterviewReports, generateInterviewReport, getInterviewReport, generateResumePdf } from "../services/interview.api.js";
import { useContext,useEffect } from "react"
import { InterviewContext } from "../interview.context.jsx"
import { useParams } from "react-router";
export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { loading, setLoading, report, setReport, reports, setReports } = context;
    const { interviewId } = useParams();
    const generateReport = async ({ resume, selfDescription, jobDescription }) => {
        try {
            setLoading(true)
            const response = await generateInterviewReport({ resume, selfDescription, jobDescription })
            setReport(response.interviewReport);
            return response;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }
    const getReport = async (interviewId) => {
        try {
            setLoading(true);
            const response = await getInterviewReport(interviewId);
            setReport(response.interviewReport)
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }
    const getAllReports = async () => {
        try {
            setLoading(true);
            const response = await getAllInterviewReports();
            setReports(response.interviewReports);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }

    const getResumePdf = async (interviewId) => {
        let response=null;
        try {
            setLoading(true);
            response = await generateResumePdf({ interviewId });
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `resume_${interviewId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        if(interviewId){
            getReport(interviewId);
        }else{
            getAllReports();
        }
    }, [interviewId])
    return { loading, report, reports, generateReport, getReport, getAllReports ,getResumePdf}
}