import React, { useEffect, useState } from "react";
import {useInterview} from "../hooks/useInterview.js"
import { useNavigate,useParams } from "react-router";


const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [openQuestion, setOpenQuestion] = useState(null);
  const {report,getReport,getResumePdf,loading}=useInterview();

  const{interviewId}=useParams();
  useEffect(()=>{
    if(interviewId){
      getReport(interviewId);
    }
  },[interviewId])
 

  if (!report) {
    return (
      <div className="min-h-screen bg-[#090b0f] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800 text-2xl">
            ⚠
          </div>

          <h1 className="text-xl font-semibold">
            Interview report not available
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please generate your interview strategy first.
          </p>
        </div>
      </div>
    );
  }

  const technicalQuestions = report.technicalQuestions || [];
  const behavioralQuestions = report.behavioralQuestions || [];
  const skillGaps = report.skillGap || [];
  const preparationPlan = report.preperationPlan || [];

  const currentQuestions =
    activeSection === "technical"
      ? technicalQuestions
      : behavioralQuestions;

  const getSectionTitle = () => {
    if (activeSection === "technical") {
      return "Technical Questions";
    }

    if (activeSection === "behavioral") {
      return "Behavioral Questions";
    }

    return "Road Map";
  };

  const getSectionCount = () => {
    if (activeSection === "technical") {
      return technicalQuestions.length;
    }

    if (activeSection === "behavioral") {
      return behavioralQuestions.length;
    }

    return preparationPlan.length;
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setOpenQuestion(null);
  };

  const toggleQuestion = (index) => {
    setOpenQuestion((previous) =>
      previous === index ? null : index
    );
  };

  // Download resume handler
  const handleDownloadResume =async () => {
        if(interviewId){
          await getResumePdf(interviewId);
        }
  }

  if(loading){
    return (
      <div className="min-h-screen bg-[#090b0f] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800 text-2xl">
            ⏳
          </div>
          <div className="text-sm text-gray-500">
             Generating your Resume, please wait...
          </div>
        </div>
      </div>
    );
  }


       
  return (
    <div className="min-h-screen bg-[#090b0f] text-white">

      {/* =========================================
          BACKGROUND GLOW
      ========================================== */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-pink-600/[0.07] blur-[130px]" />

        <div className="absolute -right-40 top-20 h-[450px] w-[450px] rounded-full bg-purple-600/[0.07] blur-[130px]" />
      </div>

      {/* =========================================
          HEADER
      ========================================== */}
      <header className="relative border-b border-gray-800/80 bg-[#0c1014]/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-7">

          {/* Brand */}
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 text-sm shadow-lg shadow-pink-500/20">
              ✦
            </div>

            <div>
              <h1 className="text-sm font-bold text-white sm:text-base">
                Interview Strategy
              </h1>

              <p className="hidden text-[11px] text-gray-500 sm:block">
                Personalized interview preparation
              </p>
            </div>

          </div>

          {/* Match score small version */}
          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                Match Score
              </p>

              <p className="text-sm font-semibold text-green-400">
                {report.matchScore ?? 0}%
              </p>
            </div>

            <div className="h-9 w-9 overflow-hidden rounded-full">
              <ScoreCircle
                score={report.matchScore ?? 0}
                small
              />
            </div>

          </div>

        </div>
      </header>

      {/* =========================================
          MAIN
      ========================================== */}
      <main className="relative mx-auto max-w-[1500px] px-3 py-3 sm:px-5 sm:py-5">

        <div
          className="grid min-h-[calc(100vh-110px)] overflow-hidden
                     rounded-2xl border border-gray-700/70
                     bg-[#11161c]/95 shadow-[0_20px_100px_rgba(0,0,0,0.4)]
                     lg:grid-cols-[235px_minmax(0,1fr)_275px]"
        >

          {/* =====================================
              LEFT SIDEBAR
          ====================================== */}
          <aside className="border-b border-gray-700/70 bg-[#12171d] lg:border-b-0 lg:border-r">

            <div className="flex h-full flex-col p-4">

              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-600">
                Sections
              </p>
            <div className="flex flex-1 flex-col justify-between">
              <div className="space-y-1.5">

                {/* Technical */}
                <SectionButton
                  active={activeSection === "technical"}
                  icon="<>"
                  title="Technical Questions"
                  count={technicalQuestions.length}
                  onClick={() => handleSectionChange("technical")}
                />

                {/* Behavioral */}
                <SectionButton
                  active={activeSection === "behavioral"}
                  icon="▱"
                  title="Behavioral Questions"
                  count={behavioralQuestions.length}
                  onClick={() => handleSectionChange("behavioral")}
                />

                {/* Roadmap */}
                <SectionButton
                  active={activeSection === "roadmap"}
                  icon="➤"
                  title="Road Map"
                  count={preparationPlan.length}
                  onClick={() => handleSectionChange("roadmap")}
                />

              </div>

              <button
                type="button"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(236,72,153,0.35)] transition hover:brightness-110"
                onClick={handleDownloadResume}
              >
                <span aria-hidden="true" className="text-base">✦</span>
                <span>Download Resume</span>
              </button>
              </div>

            </div>

           

          </aside>

          {/* =====================================
              CENTER CONTENT
          ====================================== */}
          <section className="min-w-0 bg-[#11161c]">

            {/* Content header */}
            <div className="border-b border-gray-700/70 px-5 py-5 sm:px-7">

              <div className="flex items-center gap-3">

                <h2 className="text-lg font-bold text-white sm:text-xl">
                  {getSectionTitle()}
                </h2>

                <span className="rounded-full border border-gray-700 bg-[#1a2028] px-2.5 py-1 text-[10px] font-medium text-gray-500">
                  {getSectionCount()}{" "}
                  {activeSection === "roadmap"
                    ? "days"
                    : getSectionCount() === 1
                    ? "question"
                    : "questions"}
                </span>

              </div>

              <p className="mt-1.5 text-xs text-gray-600">
                {activeSection === "technical" &&
                  "Test your technical depth and problem-solving ability."}

                {activeSection === "behavioral" &&
                  "Prepare concise answers for common behavioral questions."}

                {activeSection === "roadmap" &&
                  "Follow this roadmap to prepare systematically."}
              </p>

            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 lg:p-7">

              {activeSection === "technical" && (
                <QuestionList
                  questions={technicalQuestions}
                  openQuestion={openQuestion}
                  toggleQuestion={toggleQuestion}
                  type="technical"
                />
              )}

              {activeSection === "behavioral" && (
                <QuestionList
                  questions={behavioralQuestions}
                  openQuestion={openQuestion}
                  toggleQuestion={toggleQuestion}
                  type="behavioral"
                />
              )}

              {activeSection === "roadmap" && (
                <RoadMap plan={preparationPlan} />
              )}

            </div>

          </section>

          {/* =====================================
              RIGHT SIDEBAR
          ====================================== */}
          <aside className="border-t border-gray-700/70 bg-[#12171d] lg:border-l lg:border-t-0">

            <div className="p-5 lg:sticky lg:top-0">

              {/* Match Score */}
              <div className="border-b border-gray-800 pb-6">

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Match Score
                </p>

                <div className="mt-4 flex justify-center">
                  <ScoreCircle score={report.matchScore ?? 0} />
                </div>

                <div className="mt-4 text-center">

                  <p className="text-sm font-medium text-green-400">
                    {getScoreMessage(report.matchScore ?? 0)}
                  </p>

                  <p className="mt-1 text-[11px] text-gray-600">
                    Based on your profile and job requirements
                  </p>

                </div>

              </div>

              {/* Skill gaps */}
              <div className="pt-5">

                <div className="flex items-center justify-between">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Skill Gaps
                  </p>

                  <span className="rounded-full bg-gray-800 px-2 py-1 text-[9px] text-gray-600">
                    {skillGaps.length}
                  </span>

                </div>

                <div className="mt-4 space-y-2.5">

                  {skillGaps.length > 0 ? (
                    skillGaps.map((item, index) => (
                      <SkillGap
                        key={index}
                        skill={item.skill}
                        severity={item.severity}
                      />
                    ))
                  ) : (
                    <p className="text-xs text-gray-600">
                      No skill gaps identified.
                    </p>
                  )}

                </div>

              </div>

              

            </div>

          </aside>

        </div>

      </main>
    </div>
  );
};


/* ============================================================
   SECTION BUTTON
============================================================ */

const SectionButton = ({
  active,
  icon,
  title,
  count,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition duration-200 ${
        active
          ? "border border-pink-500/10 bg-gradient-to-r from-pink-500/10 to-purple-500/[0.04] text-pink-400 shadow-inner"
          : "border border-transparent text-gray-500 hover:bg-gray-800/50 hover:text-gray-300"
      }`}
    >

      <span
        className={`flex w-5 shrink-0 justify-center text-xs ${
          active ? "text-pink-500" : "text-gray-600 group-hover:text-gray-400"
        }`}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1 text-xs font-medium">
        {title}
      </span>

      {count > 0 && (
        <span
          className={`rounded-md px-1.5 py-0.5 text-[9px] ${
            active
              ? "bg-pink-500/10 text-pink-400"
              : "bg-gray-800 text-gray-600"
          }`}
        >
          {count}
        </span>
      )}

    </button>
  );
};


/* ============================================================
   QUESTION LIST
============================================================ */

const QuestionList = ({
  questions,
  openQuestion,
  toggleQuestion,
}) => {
  if (!questions.length) {
    return (
      <EmptyState text="No questions available in this section." />
    );
  }

  return (
    <div className="space-y-3">

      {questions.map((item, index) => {
        const isOpen = openQuestion === index;

        return (
          <QuestionItem
            key={index}
            question={item.question}
            intention={item.intention}
            answer={item.answer}
            number={index + 1}
            isOpen={isOpen}
            onClick={() => toggleQuestion(index)}
          />
        );
      })}

    </div>
  );
};


/* ============================================================
   QUESTION ITEM
============================================================ */

const QuestionItem = ({
  question,
  intention,
  answer,
  number,
  isOpen,
  onClick,
}) => {
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-[#1a2029] transition duration-200 ${
        isOpen
          ? "border-pink-500/30 shadow-lg shadow-pink-500/[0.03]"
          : "border-gray-700/70 hover:border-gray-600"
      }`}
    >

      {/* Question Header */}
      <button
        type="button"
        onClick={onClick}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left sm:px-5"
      >

        {/* Number */}
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
            isOpen
              ? "bg-pink-500/15 text-pink-400"
              : "bg-pink-500/10 text-pink-400"
          }`}
        >
          Q{number}
        </span>

        {/* Question */}
        <span className="min-w-0 flex-1 text-sm font-medium leading-6 text-gray-200">
          {question}
        </span>

        {/* Arrow */}
        <span
          className={`shrink-0 text-gray-500 transition duration-200 ${
            isOpen ? "rotate-180 text-pink-400" : ""
          }`}
        >
         ⌄
        </span>

      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="border-t border-gray-700/60">

          {/* Intention */}
          {intention && (
            <div className="border-b border-gray-700/60 bg-[#151a21] px-5 py-4">

              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-pink-400">
                What interviewer is testing
              </p>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                {intention}
              </p>

            </div>
          )}

          {/* Answer */}
          {answer && (
            <div className="bg-[#12171d] px-5 py-5">

              <div className="flex items-center gap-2">

                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-green-500/10 text-xs text-green-400">
                  ✓
                </span>

                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-green-400">
                  Suggested Answer
                </p>

              </div>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                {answer}
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
};


/* ============================================================
   ROAD MAP
============================================================ */

const RoadMap = ({ plan }) => {
  if (!plan.length) {
    return (
      <EmptyState text="No preparation roadmap available." />
    );
  }

  return (
    <div className="space-y-3">

      {plan.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-700/70 bg-[#1a2029] p-5 transition hover:border-gray-600"
        >

          <div className="flex gap-4">

            {/* Day */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10 text-xs font-bold text-pink-400 ring-1 ring-pink-500/10">
              {item.day}
            </div>

            <div className="min-w-0 flex-1">

              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-600">
                Day {item.day}
              </p>

              <h3 className="mt-1 text-sm font-semibold text-white">
                {item.focus}
              </h3>

              <div className="mt-4 space-y-2">

                {item.tasks?.map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className="flex gap-3 text-xs leading-5 text-gray-500"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />
                    <span>{task}</span>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>
      ))}

    </div>
  );
};


/* ============================================================
   MATCH SCORE
============================================================ */

const ScoreCircle = ({ score, small = false }) => {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));

  const radius = small ? 14 : 42;
  const circumference = 2 * Math.PI * radius;
  const progress =
    circumference - (safeScore / 100) * circumference;

  return (
    <svg
      viewBox="0 0 100 100"
      className={small ? "h-9 w-9" : "h-32 w-32"}
    >

      {/* Background */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#27303a"
        strokeWidth={small ? "5" : "6"}
      />

      {/* Progress */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="url(#scoreGradient)"
        strokeWidth={small ? "5" : "6"}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={progress}
        transform="rotate(-90 50 50)"
      />

      {!small && (
        <>
          <text
            x="50"
            y="48"
            textAnchor="middle"
            fill="white"
            fontSize="20"
            fontWeight="700"
          >
            {safeScore}
          </text>

          <text
            x="50"
            y="61"
            textAnchor="middle"
            fill="#6b7280"
            fontSize="7"
          >
            %
          </text>
        </>
      )}

      <defs>
        <linearGradient
          id="scoreGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>

    </svg>
  );
};


/* ============================================================
   SKILL GAP
============================================================ */

const SkillGap = ({ skill, severity }) => {
  const normalized = severity?.toLowerCase();

  const styles = {
    high: {
      container: "border-red-500/20 bg-red-500/10",
      text: "text-red-400",
      dot: "bg-red-400",
    },

    medium: {
      container: "border-yellow-500/20 bg-yellow-500/10",
      text: "text-yellow-400",
      dot: "bg-yellow-400",
    },

    low: {
      container: "border-green-500/20 bg-green-500/10",
      text: "text-green-400",
      dot: "bg-green-400",
    },
  };

  const style =
    styles[normalized] || {
      container: "border-gray-700 bg-gray-800/60",
      text: "text-gray-400",
      dot: "bg-gray-500",
    };

  return (
    <div
      className={`rounded-lg border px-3 py-3 ${style.container}`}
    >

      <div className="flex items-start gap-2.5">

        <span
          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
        />

        <div className="min-w-0">

          <p className={`text-xs font-medium leading-5 ${style.text}`}>
            {skill}
          </p>

          <p className="mt-1 text-[9px] uppercase tracking-wider text-gray-600">
            {severity}
          </p>

        </div>

      </div>

    </div>
  );
};


/* ============================================================
   OVERVIEW ROW
============================================================ */

const OverviewRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between">

      <span className="text-xs text-gray-600">
        {label}
      </span>

      <span className="text-xs font-semibold text-gray-300">
        {value}
      </span>

    </div>
  );
};


/* ============================================================
   EMPTY STATE
============================================================ */

const EmptyState = ({ text }) => {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-gray-700 bg-[#151a20]">
      <p className="text-xs text-gray-600">
        {text}
      </p>
    </div>
  );
};


/* ============================================================
   SCORE MESSAGE
============================================================ */

const getScoreMessage = (score) => {
  if (score >= 85) return "Strong match for this role";
  if (score >= 70) return "Good match for this role";
  if (score >= 50) return "Moderate match for this role";

  return "More preparation recommended";
};

export default Interview;