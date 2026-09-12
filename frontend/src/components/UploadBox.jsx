import { useRef, useState } from "react";
import API_BASE_URL from "../services/api";
import { useNavigate } from "react-router-dom";
import {
    FiUploadCloud,
    FiFileText,
    FiUsers,
    FiCalendar,
    FiClock,
    FiDollarSign,
    FiBookOpen,
    FiAlertTriangle,
    FiCheckCircle,
    FiMessageSquare,
    FiDownload,
    FiCopy,
    FiX,
    FiLoader,
} from "react-icons/fi";

const riskStyles = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-green-100 text-green-700",
};

function RiskBadge({ level }) {
    return (
        <span className={`font-semibold px-3 py-1 rounded-full text-xs ${riskStyles[level] || "bg-slate-100 text-slate-700"}`}>
            {level}
        </span>
    );
}

function SectionCard({ icon: Icon, title, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <h3 className="flex items-center gap-2 font-bold text-lg text-slate-900">
                {Icon && (
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                        <Icon size={16} />
                    </span>
                )}
                {title}
            </h3>
            <div className="mt-4">{children}</div>
        </div>
    );
}

function UploadBox() {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [contractText, setContractText] = useState("");
    const [enhancedContract, setEnhancedContract] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [rewrittenClauses, setRewrittenClauses] = useState({});
    const [appliedClauses, setAppliedClauses] = useState({});
    const [loadingClause, setLoadingClause] = useState(null);
    const [askingQuestion, setAskingQuestion] = useState(false);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const processFile = async (file) => {
        if (!file) return;

        setFileName(file.name);

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 422) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                    throw new Error("Your session has expired. Please log in again.");
                }
                throw new Error(data.error || data.message || data.msg || "Upload failed.");
            }

            setContractText(data.contract_text);
            setEnhancedContract(data.contract_text);

            setAnalysis(data.summary);
        } catch (error) {
            console.error(error);
            alert(error.message || "Upload failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        processFile(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        processFile(file);
    };

    const handleAskQuestion = async () => {

        if (!question.trim()) {
            alert("Please enter a question.");
            return;
        }

        try {
            setAskingQuestion(true);

            const token = localStorage.getItem("token");

            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    contract_text: contractText,
                    question: question,
                }),
            });

            const data = await response.json();

            setAnswer(data.answer);

        } catch (error) {
            console.error(error);
            alert("Failed to get AI response.");
        } finally {
            setAskingQuestion(false);
        }
    };
    const handleRewriteClause = async (index, originalClause) => {

        try {

            setLoadingClause(index);

            const token = localStorage.getItem("token");

            const response = await fetch(`${API_BASE_URL}/rewrite-clause`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    original_clause: originalClause,
                }),
            });

            const data = await response.json();

            setRewrittenClauses((prev) => ({
                ...prev,
                [index]: data.rewritten_clause,
            }));

        } catch (error) {
            console.error(error);
            alert("Failed to rewrite clause.");
        } finally {
            setLoadingClause(null);
        }
    };
    const handleApplyClause = (index, originalClause) => {

        const rewrittenClause = rewrittenClauses[index];

        if (!rewrittenClause) return;

        setEnhancedContract((prev) =>
            prev.replace(originalClause, rewrittenClause)
        );

        setAppliedClauses((prev) => ({
            ...prev,
            [index]: true,
        }));
    };

    const handleRejectClause = (index) => {

        setRewrittenClauses((prev) => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });

    };

    return (
        <div>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-colors ${isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-300 bg-slate-50"
                    }`}
            >
                <span className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-blue-100 text-blue-600">
                    <FiUploadCloud size={26} />
                </span>

                <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-slate-800">
                    Upload Your Contract
                </h2>

                <p className="text-slate-500 mt-2 text-sm">
                    Drag & drop a file here, or browse. Supports PDF, DOCX, and scanned images (PNG/JPG).
                </p>

                <input
                    type="file"
                    accept=".pdf,.docx,.png,.jpg,.jpeg"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <button
                    onClick={handleButtonClick}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
                >
                    Choose File
                </button>

                {fileName && !loading && (
                    <p className="mt-4 text-sm text-slate-600">
                        Selected: <span className="font-medium">{fileName}</span>
                    </p>
                )}

                {loading && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-blue-600 text-sm font-medium">
                        <FiLoader className="animate-spin" size={16} />
                        Reading contract...
                    </div>
                )}
            </div>

            {analysis && (
                <div className="mt-8 text-left space-y-6">

                    {/* Key Information */}
                    <SectionCard icon={FiFileText} title="Key Information">
                        <div className="grid sm:grid-cols-2 gap-5">

                            <div>
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <FiFileText size={13} />
                                    Contract Type
                                </span>
                                <p className="mt-1 text-slate-800">{analysis.contract_type || "Not specified"}</p>
                            </div>

                            <div>
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <FiUsers size={13} />
                                    Parties
                                </span>

                                {analysis.parties.length === 0 ? (
                                    <p className="mt-1 text-slate-400">
                                        No parties found.
                                    </p>
                                ) : (
                                    <ul className="list-disc list-inside mt-1 text-slate-800">
                                        {analysis.parties.map((party, index) => (
                                            <li key={index}>
                                                {party}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <FiCalendar size={13} />
                                    Effective Date
                                </span>
                                <p className="mt-1 text-slate-800">
                                    {analysis.effective_date || "Not specified"}
                                </p>
                            </div>

                            <div>
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <FiClock size={13} />
                                    Duration
                                </span>
                                <p className="mt-1 text-slate-800">
                                    {analysis.duration || "Not specified"}
                                </p>
                            </div>

                            <div>
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <FiDollarSign size={13} />
                                    Payment Terms
                                </span>
                                <p className="mt-1 text-slate-800">
                                    {analysis.payment_terms || "Not specified"}
                                </p>
                            </div>
                            <div>
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <FiBookOpen size={13} />
                                    Governing Law
                                </span>
                                <p className="mt-1 text-slate-800">
                                    {analysis.governing_law || "Not specified"}
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Overall Risk
                                </span>

                                <div className="mt-2 flex items-center gap-3">
                                    <RiskBadge level={analysis.risk_level} />
                                    <span className="text-slate-700 font-medium text-sm">
                                        {analysis.risk_score}/100
                                    </span>
                                </div>
                            </div>

                        </div>
                    </SectionCard>

                    {/* Summary */}
                    <SectionCard icon={FiBookOpen} title="Summary">
                        <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                            {analysis.summary || "No summary available."}
                        </p>
                    </SectionCard>

                    {/* Risky Clauses */}
                    <SectionCard icon={FiAlertTriangle} title="Risky Clauses">
                        {analysis.risky_clauses.length === 0 ? (
                            <p className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                <FiCheckCircle size={16} />
                                No risky clauses detected.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {analysis.risky_clauses.map((risk, index) => (
                                    <div
                                        key={index}
                                        className="border border-red-200 rounded-xl p-4 sm:p-5 bg-red-50/50"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <h4 className="text-base sm:text-lg font-bold text-slate-900">
                                                {risk.clause}
                                            </h4>
                                            <RiskBadge level={risk.severity} />
                                        </div>

                                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Original Clause
                                        </p>

                                        <p className="bg-white border border-slate-200 p-3 rounded-lg mt-1 italic text-slate-700 text-sm">
                                            {risk.original_text || "Not available"}
                                        </p>

                                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            In Simple Terms
                                        </p>

                                        <p className="text-slate-700 text-sm mt-1">
                                            {risk.plain_english}
                                        </p>

                                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Why is it risky?
                                        </p>

                                        <p className="text-slate-700 text-sm mt-1">
                                            {risk.reason}
                                        </p>

                                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Suggested Improvement
                                        </p>

                                        <p className="text-green-700 font-medium text-sm mt-1">
                                            {risk.suggestion}
                                        </p>

                                        <div className="mt-4">
                                            <button
                                                onClick={() => handleRewriteClause(index, risk.original_text)}
                                                disabled={loadingClause === index}
                                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                            >
                                                {loadingClause === index ? (
                                                    <>
                                                        <FiLoader className="animate-spin" size={14} />
                                                        Rewriting...
                                                    </>
                                                ) : (
                                                    "✨ Rewrite Clause"
                                                )}
                                            </button>
                                        </div>
                                        {rewrittenClauses[index] && (
                                            <div className="mt-5 border border-green-200 rounded-xl bg-green-50 p-4">

                                                <h4 className="font-bold text-green-700 flex items-center gap-2 text-sm">
                                                    <FiCheckCircle size={15} />
                                                    AI Rewritten Clause
                                                </h4>

                                                <p className="mt-2 whitespace-pre-wrap text-slate-700 text-sm">
                                                    {rewrittenClauses[index]}
                                                </p>

                                                <div className="flex flex-wrap gap-3 mt-4">

                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(rewrittenClauses[index])}
                                                        className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                                    >
                                                        <FiCopy size={14} />
                                                        Copy
                                                    </button>

                                                    {!appliedClauses[index] ? (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    handleApplyClause(index, risk.original_text)
                                                                }
                                                                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                                            >
                                                                <FiCheckCircle size={14} />
                                                                Apply
                                                            </button>

                                                            <button
                                                                onClick={() => handleRejectClause(index)}
                                                                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                                            >
                                                                <FiX size={14} />
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm">
                                                            <FiCheckCircle size={14} />
                                                            Applied
                                                        </span>
                                                    )}

                                                </div>

                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </SectionCard>

                    {/* AI Recommendations */}
                    <SectionCard icon={FiCheckCircle} title="AI Recommendations">
                        {analysis.recommendations.length === 0 ? (
                            <p className="text-green-600 text-sm font-medium">
                                No recommendations. The contract appears well structured.
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {analysis.recommendations.map((recommendation, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-slate-700"
                                    >
                                        <FiCheckCircle className="text-amber-600 shrink-0 mt-0.5" size={15} />
                                        {recommendation}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </SectionCard>

                    {/* AI Chat */}
                    <SectionCard icon={FiMessageSquare} title="Chat with Your Contract">
                        <p className="text-slate-500 -mt-2 mb-4 text-sm">
                            Ask any question about the uploaded contract.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Example: Can either party terminate immediately?"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="flex-1 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />

                            <button
                                onClick={handleAskQuestion}
                                disabled={askingQuestion}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-3 sm:py-0 rounded-xl text-sm font-semibold transition shrink-0"
                            >
                                {askingQuestion ? <FiLoader className="animate-spin" size={15} /> : "Ask AI"}
                            </button>
                        </div>

                        {answer && (
                            <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-4">
                                <h4 className="font-semibold mb-2 text-sm text-slate-800">
                                    AI Answer
                                </h4>

                                <p className="whitespace-pre-wrap text-slate-700 text-sm">
                                    {answer}
                                </p>
                            </div>
                        )}
                    </SectionCard>

                    {/* Enhanced Contract */}
                    <SectionCard icon={FiFileText} title="Enhanced Contract Preview">
                        <p className="text-slate-500 -mt-2 mb-4 text-sm">
                            This contract is updated as you accept AI suggestions.
                        </p>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-[500px] overflow-y-auto scrollbar-thin">
                            <pre className="whitespace-pre-wrap leading-7 text-sm text-slate-700 font-sans">
                                {enhancedContract}
                            </pre>
                        </div>
                        {enhancedContract !== contractText && (
                            <div className="mt-5 text-center">
                                <button
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem("token");

                                            const response = await fetch(`${API_BASE_URL}/download-enhanced-docx`, {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "Authorization": `Bearer ${token}`,
                                                },
                                                body: JSON.stringify({
                                                    title: `${analysis.contract_type || "Contract"} - Enhanced`,
                                                    content: enhancedContract,
                                                }),
                                            });

                                            const blob = await response.blob();
                                            const url = window.URL.createObjectURL(blob);

                                            const a = document.createElement("a");
                                            a.href = url;
                                            a.download = `${analysis.contract_type || "Contract"} - Enhanced.docx`;

                                            document.body.appendChild(a);
                                            a.click();
                                            a.remove();

                                            window.URL.revokeObjectURL(url);

                                        } catch (error) {
                                            console.error(error);
                                            alert("Failed to download enhanced contract.");
                                        }
                                    }}
                                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition"
                                >
                                    <FiDownload size={16} />
                                    Download Enhanced DOCX
                                </button>
                            </div>
                        )}
                    </SectionCard>

                </div>
            )}
        </div>
    );
}

export default UploadBox;
