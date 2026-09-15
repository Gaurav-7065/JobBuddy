import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";
const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const MAX_CHARS = 5000;
  const isReady = jobDescription.trim() && (resume || selfDescription.trim());
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <h1>Loading You Interview Plan</h1>
      </div>

    )
  }

  // Handle file
  const handleFile = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    setResume(file);
  };

  // File input
  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  // Drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  // Generate strategy->handleSubmit
  const handleGenerateReport = async (e) => {
    e.preventDefault();

    if (!jobDescription.trim()) {
      alert("Please enter the job description.");
      return;
    }

    if (!resume && !selfDescription.trim()) {
      alert("Please upload a resume or provide a self-description.");
      return;
    }

    const resumeFile = fileInputRef.current?.files[0] || resume;
    const data = await generateReport({ resume: resumeFile, selfDescription, jobDescription });
    navigate(`/interview/${data.interviewReport._id}`);
  };

  return (
    <div className="min-h-screen bg-[#090b0f] text-white">

      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-[-200px] h-[400px] w-[400px] rounded-full bg-pink-600/10 blur-[120px]" />
        <div className="absolute right-1/4 top-[-150px] h-[350px] w-[350px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="mx-auto mb-8 max-w-3xl text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/5 px-4 py-1.5 text-xs font-medium text-pink-400">
            <span>✦</span>
            AI-Powered Interview Preparation
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Create Your Custom{" "}
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
              Interview Plan
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
            Let our AI analyze the job requirements and your unique profile
            to build a personalized interview strategy.
          </p>

          <div className="mt-4 text-gray-600">
            ↓
          </div>
        </div>

        {/* ================= MAIN CARD ================= */}
        <div className="overflow-hidden rounded-2xl border border-gray-700/70 bg-[#11151a]/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

          <form onSubmit={handleGenerateReport}>

            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* ================= LEFT ================= */}
              <div className="border-b border-gray-700/70 p-5 sm:p-7 lg:border-b-0 lg:border-r">

                {/* Section Header */}
                <div className="mb-5 flex items-center justify-between border-b border-gray-700/60 pb-4">

                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500">
                      💼
                    </div>

                    <h2 className="text-sm font-semibold text-white">
                      Target Job Description
                    </h2>
                  </div>

                  <span className="rounded-md border border-pink-500/20 bg-pink-500/5 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-pink-400">
                    Required
                  </span>

                </div>

                {/* Job Description */}
                <div className="relative">

                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={jobDescription}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_CHARS) {
                        setJobDescription(e.target.value);
                      }
                    }}
                    maxLength={MAX_CHARS}
                    placeholder={`Paste the full job description here...

e.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."`}
                    className="min-h-[420px] w-full resize-none rounded-xl border border-gray-700
                               bg-[#1b2028] px-4 py-4 pb-10 text-sm leading-6 text-gray-200
                               placeholder:text-gray-600 outline-none transition
                               focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/10"
                    required
                  />

                  {/* Character Counter */}
                  <div className="absolute bottom-3 right-4 text-[11px] text-gray-500">
                    {jobDescription.length} / {MAX_CHARS} chars
                  </div>

                </div>
              </div>

              {/* ================= RIGHT ================= */}
              <div className="p-5 sm:p-7">

                {/* Section Header */}
                <div className="mb-5 flex items-center gap-2.5 border-b border-gray-700/60 pb-4">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500">
                    👤
                  </div>

                  <h2 className="text-sm font-semibold text-white">
                    Your Profile
                  </h2>

                </div>

                {/* ================= RESUME ================= */}
                <div>

                  <div className="mb-2 flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Upload Resume
                    </label>

                    <span className="text-[10px] font-medium text-pink-500">
                      Recommended
                    </span>
                  </div>

                  {/* Dropzone */}
                  {!resume ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current.click()}
                      className={`group flex min-h-[180px] cursor-pointer flex-col items-center
                                  justify-center rounded-xl border border-dashed
                                  px-6 text-center transition duration-200
                                  ${isDragging
                          ? "border-pink-500 bg-pink-500/10"
                          : "border-gray-600 bg-[#171b21] hover:border-pink-500/60 hover:bg-pink-500/[0.03]"
                        }`}
                    >

                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-600 bg-[#1d232b] text-xl transition group-hover:border-pink-500/40">
                        ☁
                      </div>

                      <p className="text-sm font-medium text-gray-200">
                        Click to upload or drag & drop
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        PDF only • Max 5MB
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                    </div>
                  ) : (
                    /* Uploaded File */
                    <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-4">

                      <div className="flex items-center justify-between">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-lg">
                            📄
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-200">
                              {resume.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {(resume.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>

                        </div>

                        <button
                          type="button"
                          onClick={() => setResume(null)}
                          className="ml-3 text-xs text-gray-500 transition hover:text-red-400"
                        >
                          Remove
                        </button>

                      </div>

                    </div>
                  )}
                </div>

                {/* ================= OR ================= */}
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gray-700" />
                  <span className="text-xs text-gray-600">OR</span>
                  <div className="h-px flex-1 bg-gray-700" />
                </div>

                {/* ================= SELF DESCRIPTION ================= */}
                <div>

                  <label
                    htmlFor="selfDescription"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Quick Self-Description
                  </label>

                  <textarea
                    id="selfDescription"
                    name="selfDescription"
                    rows={5}
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                    className="w-full resize-none rounded-xl border border-gray-700
                               bg-[#1b2028] px-4 py-3 text-sm leading-6 text-gray-200
                               placeholder:text-gray-600 outline-none transition
                               focus:border-pink-500/60 focus:ring-2
                               focus:ring-pink-500/10"
                  />

                </div>

                {/* ================= INFO ================= */}
                <div className="mt-5 rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3">

                  <div className="flex gap-3">

                    <span className="mt-0.5 text-blue-400">
                      ⓘ
                    </span>

                    <p className="text-xs leading-5 text-gray-400">
                      Either a resume or a self-description is required to
                      generate a personalized interview plan.
                    </p>

                  </div>

                </div>

              </div>
            </div>


            {/* ================= FOOTER ================= */}
            <div className="flex flex-col gap-4 border-t border-gray-700/70 bg-[#0f1317] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

              <div>
                <p className="text-xs text-gray-500">
                  AI-Powered Strategy Generation
                </p>

                <p className="mt-1 text-[11px] text-gray-600">
                  Usually takes less than 30 seconds
                </p>
              </div>

              <button
                type="submit"
                disabled={!isReady || loading}
                className={`flex items-center justify-center gap-2 rounded-xl
                            px-7 py-3 text-sm font-semibold
                            transition duration-200
                            ${isReady && !loading
                    ? "cursor-pointer bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 text-white shadow-lg shadow-pink-500/20 hover:-translate-y-0.5 hover:shadow-pink-500/30 active:scale-[0.98]"
                    : "cursor-not-allowed bg-gray-700 text-gray-400"
                  }`}
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-white" />
                    Generating Strategy...
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    Generate My Interview Strategy
                  </>
                )}
              </button>

            </div>

          </form>
        </div>
        <hr/>

        {/* recent reports list */}
        {reports.length > 0 && (
          <section className="border-t border-gray-700/70 bg-[#0d1116] px-5 py-6 sm:px-7" aria-labelledby="recent-reports-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-pink-400">
                  Your workspace
                </p>
                <h3 id="recent-reports-heading" className="mt-1 text-lg font-semibold text-white">
                  Recent Reports
                </h3>
              </div>
              <span className="rounded-full border border-gray-700 bg-gray-800/60 px-3 py-1 text-xs text-gray-400">
                {reports.length} {reports.length === 1 ? "report" : "reports"}
              </span>
            </div>

            <ul className="grid gap-3 md:grid-cols-2">
              {reports.map((report) => (
                <li key={report._id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/interview/${report._id}`)}
                    className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-gray-700/70 bg-[#151a21] p-4 text-left transition hover:-translate-y-0.5 hover:border-pink-500/40 hover:bg-[#191e27] focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    aria-label={`View interview report for ${report.title || "Untitled Position"}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 text-lg">
                        ✦
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold text-gray-100">
                          {report.title || "Untitled Position"}
                        </h4>
                        <p className="mt-1 text-xs text-gray-500">
                          Generated {report.createdAt
                            ? new Date(report.createdAt).toLocaleDateString()
                            : "recently"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-pink-400">
                          {report.matchScore ?? 0}%
                        </p>
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">
                          match
                        </p>
                      </div>
                      <span className="text-lg text-gray-600 transition group-hover:translate-x-0.5 group-hover:text-pink-400">
                        →
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
        

        {/* Bottom text */}
        <p className="mt-5 text-center text-[11px] text-gray-600">
          Your information is used only to personalize your interview
          preparation experience.
        </p>

      </div>
    </div>
  );
};

export default Home;