import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import "dotenv/config";
import puppeteer from "puppeteer";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
}); 


// ================================
// ZOD SCHEMA
// ================================

const interviewReportSchema = z.object({

    matchScore: z.number()
        .min(0)
        .max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    )
        .min(5)
        .max(10),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    )
        .min(3)
        .max(6),

    skillGap: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum([
                "low",
                "medium",
                "high"
            ])
        })
    ),

    preperationPlan: z.array(
        z.object({
            day: z.number()
                .int()
                .min(1),

            focus: z.string(),

            tasks: z.array(
                z.string()
            )
                .min(2)
                .max(5)
        })
    )
        .min(5)
        .max(14)
    ,
    title: z.string()
});


// ================================
// JSON SCHEMA FOR GEMINI
// ================================

const interviewReportJsonSchema = {

    type: "object",

    properties: {

        matchScore: {
            type: "number",
            description: "Job matching score between 0 and 100"
        },

        technicalQuestions: {

            type: "array",

            description:
                "Technical interview questions based on candidate resume and job description",

            items: {

                type: "object",

                properties: {

                    question: {
                        type: "string"
                    },

                    intention: {
                        type: "string"
                    },

                    answer: {
                        type: "string"
                    }

                },

                required: [
                    "question",
                    "intention",
                    "answer"
                ],

                additionalProperties: false
            }
        },


        behavioralQuestions: {

            type: "array",

            description:
                "Behavioral interview questions for the candidate",

            items: {

                type: "object",

                properties: {

                    question: {
                        type: "string"
                    },

                    intention: {
                        type: "string"
                    },

                    answer: {
                        type: "string"
                    }

                },

                required: [
                    "question",
                    "intention",
                    "answer"
                ],

                additionalProperties: false
            }
        },


        skillGap: {

            type: "array",

            description:
                "Skills that the candidate needs to improve",

            items: {

                type: "object",

                properties: {

                    skill: {
                        type: "string"
                    },

                    severity: {

                        type: "string",

                        enum: [
                            "low",
                            "medium",
                            "high"
                        ]
                    }

                },

                required: [
                    "skill",
                    "severity"
                ],

                additionalProperties: false
            }
        },


        preperationPlan: {

            type: "array",

            description:
                "Day wise interview preparation plan",

            items: {

                type: "object",

                properties: {

                    day: {
                        type: "number"
                    },

                    focus: {
                        type: "string"
                    },

                    tasks: {

                        type: "array",

                        items: {
                            type: "string"
                        }

                    }

                },

                required: [
                    "day",
                    "focus",
                    "tasks"
                ],

                additionalProperties: false
            }
        },
        title: {
            type: "string",
            description: "The title of the job for which the interview report is generated"
        }

    },

    required: [
        "title",
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGap",
        "preperationPlan"
    ],

    additionalProperties: false
};


// ================================
// GENERATE INTERVIEW REPORT
// ================================

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `

You are an expert technical interviewer.

Analyze the candidate's resume, self-description,
and the given job description.

Generate an interview preparation report.


========================
CANDIDATE RESUME
========================

${resume}


========================
SELF DESCRIPTION
========================

${selfDescription}


========================
JOB DESCRIPTION
========================

${jobDescription}


========================
IMPORTANT INSTRUCTIONS
========================

You MUST follow the exact JSON structure
provided in the response schema.

DO NOT create your own JSON structure.

DO NOT add any extra fields.

ONLY return these fields:

- title
- matchScore
- technicalQuestions
- behavioralQuestions
- skillGap
- preperationPlan


========================
MATCH SCORE
========================

Calculate how well the candidate matches
the job description.

The value must be a number between 0 and 100.


========================
TECHNICAL QUESTIONS
========================

Generate 5 to 10 technical interview questions.

Questions should be based on:

- Candidate's resume
- Candidate's projects
- Candidate's technical skills
- Job description

Each question MUST contain:

question
intention
answer


========================
BEHAVIORAL QUESTIONS
========================

Generate 3 to 6 behavioral interview questions.

Questions should be relevant to the candidate's
background and the given job.

Each question MUST contain:

question
intention
answer


========================
SKILL GAP
========================

Identify the skills the candidate is missing
or needs to improve based on the job description.

Each skill gap MUST contain:

skill
severity

severity MUST be exactly one of:

low
medium
high


========================
PREPARATION PLAN
========================

Generate a 5 to 14 day preparation plan.

Each day MUST contain:

day
focus
tasks

tasks MUST be an array of strings.

Each day MUST contain between 2 and 5 tasks.

The preparation plan should prioritize
the candidate's skill gaps and the requirements
of the job description.


========================

Return ONLY valid JSON.

Do not return markdown.

Do not return explanations outside the JSON.

`;


    try {

        // ================================
        // GEMINI API CALL
        // ================================

        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash    ",

            contents: prompt,

            config: {

                responseMimeType: "application/json",

                responseJsonSchema:
                    interviewReportJsonSchema,

                temperature: 0.2

            }

        });


        // ================================
        // CHECK GEMINI RESPONSE
        // ================================

        if (!response.text) {
            throw new Error("Gemini returned an empty response");
        }


        // ================================
        // CONVERT JSON STRING TO OBJECT
        // ================================

        const report = JSON.parse(response.text);


        console.log(
            "Gemini Report:",
            JSON.stringify(
                report,
                null,
                2
            )
        );


        // ================================
        // VALIDATE USING ZOD
        // ================================

        const validatedReport =
            interviewReportSchema.parse(report);


        // ================================
        // RETURN FINAL REPORT
        // ================================

        return validatedReport;

    } catch (error) {

        console.error(
            "Error generating interview report:",
            error
        );

        throw new Error(
            `Failed to generate interview report: ${error.message}`,
            { cause: error }
        );

    }

}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' ,margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }});
    await browser.close();
    return pdfBuffer;
}


export async function generateResumePdf({ selfDescription, jobDescription, resume }) {

    const resumePdfSchema = z.object({
        html: z.string()
    });
    const resumePdfJsonSchema = {
        type: "object",
        properties: {
            html: {
                type: "string"
            },
            additionalProperties: false
        },
        
    };
    const prompt = `Generate a resume  for a cadidate with following details:
                    Self Description: ${selfDescription}
                    resume: ${resume}
                    Job Description: ${jobDescription}
                    The response should be a valid JSON with a single field "html" which contains the HTML content of the resume.
                    The resume should be tailored for the given jobdescription and should highlight the candidate's skills and experience relevant to the job.
                    The content of resume should be not sound like it's generated by Ai and should be as close as possible to a real human written resume.
                    The Content should be Ats friendly ,i.e it should be easily parsable by ATS systems without losing important information.
                    The resume should be in 1 page so that every information included is relevant and important for the job.
                    Focus on quality rather than quatity and make to include all the relevant imformation that can help the candidate to get shortlisted for the job.
                    not use any generic phrases like "hardworking" or "team player". Instead, focus on specific skills, experiences, and achievements that demonstrate the candidate's qualifications for the job.
                    give all link in the format of clickable link and not in the format of plain text.
                    The spacing and Font size should be appropriate and should not be too small or too big.

                    `
                    
    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,   
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: resumePdfJsonSchema
        }
    }
    )
    const report = JSON.parse(response.text);
    const validatedReport = resumePdfSchema.parse(report);
    const pdfBuffer = await generatePdfFromHtml(validatedReport.html);
    return pdfBuffer;


}




export default generateInterviewReport;