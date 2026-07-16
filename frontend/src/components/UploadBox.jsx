import { useRef, useState } from "react";
import API_BASE_URL from "../services/api";
import { useNavigate } from "react-router-dom";

function UploadBox() {
    const fileInputRef = useRef(null);

    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [contractText, setContractText] = useState("");
    const [enhancedContract, setEnhancedContract] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [rewrittenClauses, setRewrittenClauses] = useState({});
    const [appliedClauses, setAppliedClauses] = useState({});
    const [loadingClause, setLoadingClause] = useState(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        setFileName(file.name);

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setContractText(data.contract_text);
            setEnhancedContract(data.contract_text);

            setAnalysis(data.summary);
        } catch (error) {
            console.error(error);
            alert("Upload failed.");
        } finally {
            setLoading(false);
        }
    };
    const handleAskQuestion = async () => {

        if (!question.trim()) {
            alert("Please enter a question.");
            return;
        }

        try {

            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
        }
    };
    const handleRewriteClause = async (index, originalClause) => {

        try {

            setLoadingClause(index);

            const response = await fetch(`${API_BASE_URL}/rewrite-clause`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
        <div className="mt-8 border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50">
            <h2 className="text-2xl font-semibold text-gray-700">
                Upload Your Contract
            </h2>

            <p className="text-gray-500 mt-2">
                Drag & drop your PDF here or click below.
            </p>

            <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            <button
                onClick={handleButtonClick}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
                Choose PDF
            </button>

            {fileName && (
                <p className="mt-4 text-green-600">
                    Selected: {fileName}
                </p>
            )}

            {loading && (
                <p className="mt-4 text-blue-600">
                    Reading contract...
                </p>
            )}

            {analysis && (
                <div className="mt-8 text-left space-y-6">

                    {/* Key Information */}
                    <div className="bg-white rounded-xl shadow p-5 border">
                        <h3 className="font-bold text-xl mb-4">
                            📋 Key Information
                        </h3>

                        <div className="space-y-4">

                            <div>
                                <span className="font-semibold">
                                    📄 Contract Type:
                                </span>
                                <p>{analysis.contract_type || "Not specified"}</p>
                            </div>

                            <div>
                                <span className="font-semibold">
                                    👥 Parties:
                                </span>

                                {analysis.parties.length === 0 ? (
                                    <p className="text-gray-500">
                                        No parties found.
                                    </p>
                                ) : (
                                    <ul className="list-disc list-inside mt-1">
                                        {analysis.parties.map((party, index) => (
                                            <li key={index}>
                                                {party}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <span className="font-semibold">
                                    📅 Effective Date:
                                </span>
                                <p>
                                    {analysis.effective_date || "Not specified"}
                                </p>
                            </div>

                            <div>
                                <span className="font-semibold">
                                    ⏳ Duration:
                                </span>
                                <p>
                                    {analysis.duration || "Not specified"}
                                </p>
                            </div>

                            <div>
                                <span className="font-semibold">
                                    💰 Payment Terms:
                                </span>
                                <p>
                                    {analysis.payment_terms || "Not specified"}
                                </p>
                            </div>
                            <div>
                                <span className="font-semibold">
                                    ⚖️ Governing Law:
                                </span>
                                <p>
                                    {analysis.governing_law || "Not specified"}
                                </p>
                            </div>

                            <div>
                                <span className="font-semibold">
                                    ⚠️ Overall Risk
                                </span>

                                <div className="mt-2 flex items-center gap-3">

                                    <span
                                        className={`font-semibold px-3 py-1 rounded-full text-sm ${analysis.risk_level === "High"
                                            ? "bg-red-100 text-red-700"
                                            : analysis.risk_level === "Medium"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {analysis.risk_level}
                                    </span>

                                    <span className="text-gray-700 font-medium">
                                        {analysis.risk_score}/100
                                    </span>

                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-xl shadow p-5 border">
                        <h3 className="font-bold text-lg">
                            📝 Summary
                        </h3>

                        <p className="mt-2 whitespace-pre-wrap">
                            {analysis.summary || "No summary available."}
                        </p>
                    </div>

                    {/* Risky Clauses */}
                    <div className="bg-white rounded-xl shadow p-5 border">
                        <h3 className="font-bold text-lg">
                            🚨 Risky Clauses
                        </h3>

                        {analysis.risky_clauses.length === 0 ? (
                            <p className="mt-2 text-green-600">
                                No risky clauses detected.
                            </p>
                        ) : (
                            analysis.risky_clauses.map((risk, index) => (
                                <div
                                    key={index}
                                    className="mt-4 border rounded-lg p-4 bg-red-50"
                                >
                                    <h4 className="text-lg font-bold">
                                        🚨 {risk.clause}
                                    </h4>

                                    <p className="mt-3">
                                        <strong>⚠️ Severity:</strong>{" "}

                                        <span
                                            className={`font-semibold px-3 py-1 rounded-full text-sm ${risk.severity === "High"
                                                ? "bg-red-100 text-red-700"
                                                : risk.severity === "Medium"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {risk.severity}
                                        </span>
                                    </p>


                                    <p className="mt-2">
                                        <strong>📄 Original Clause:</strong>
                                    </p>

                                    <p className="bg-gray-100 p-3 rounded mt-1 italic">
                                        {risk.original_text || "Not available"}
                                    </p>

                                    <p className="mt-3">
                                        <strong>📝 In Simple Terms:</strong>
                                    </p>

                                    <p>
                                        {risk.plain_english}
                                    </p>

                                    <p className="mt-3">
                                        <strong>❓ Why is it risky?</strong>
                                    </p>

                                    <p>
                                        {risk.reason}
                                    </p>

                                    <p className="mt-3">
                                        <strong>✅ Suggested Improvement:</strong>
                                    </p>

                                    <p className="text-green-700 font-medium">
                                        {risk.suggestion}
                                    </p>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleRewriteClause(index, risk.original_text)}
                                            disabled={loadingClause === index}
                                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
                                        >
                                            {loadingClause === index ? "Rewriting..." : "✨ Rewrite Clause"}
                                        </button>
                                    </div>
                                    {rewrittenClauses[index] && (
                                        <div className="mt-5 border rounded-lg bg-green-50 p-4">

                                            <h4 className="font-bold text-green-700">
                                                ✨ AI Rewritten Clause
                                            </h4>

                                            <p className="mt-2 whitespace-pre-wrap">
                                                {rewrittenClauses[index]}
                                            </p>

                                            <div className="flex gap-3 mt-4">

                                                <button
                                                    onClick={() => navigator.clipboard.writeText(rewrittenClauses[index])}
                                                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
                                                >
                                                    📋 Copy
                                                </button>

                                                {!appliedClauses[index] ? (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleApplyClause(index, risk.original_text)
                                                            }
                                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                                        >
                                                            ✅ Apply
                                                        </button>

                                                        <button
                                                            onClick={() => handleRejectClause(index)}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                                        >
                                                            ❌ Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                                                        ✅ Applied
                                                    </span>
                                                )}

                                            </div>

                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    {/* AI Recommendations */}
                    <div className="bg-white rounded-xl shadow p-5 border">
                        <h3 className="font-bold text-lg">
                            💡 AI Recommendations
                        </h3>

                        {analysis.recommendations.length === 0 ? (
                            <p className="mt-2 text-green-600">
                                No recommendations. The contract appears well structured.
                            </p>
                        ) : (
                            <ul className="mt-3 space-y-3">
                                {analysis.recommendations.map((recommendation, index) => (
                                    <li
                                        key={index}
                                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                                    >
                                        ✅ {recommendation}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* AI Chat */}
                    <div className="bg-white rounded-xl shadow p-5 border">
                        <h3 className="font-bold text-lg">
                            💬 Chat with Your Contract
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Ask any question about the uploaded contract.
                        </p>

                        <input
                            type="text"
                            placeholder="Example: Can either party terminate immediately?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full mt-4 border rounded-lg p-3"
                        />

                        <button
                            onClick={handleAskQuestion}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                        >
                            Ask AI
                        </button>

                        {answer && (
                            <div className="mt-5 bg-gray-100 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">
                                    🤖 AI Answer
                                </h4>

                                <p className="whitespace-pre-wrap">
                                    {answer}
                                </p>
                            </div>
                        )}
                    </div>
                    {/* Enhanced Contract */}

                    <div className="bg-white rounded-xl shadow p-5 border">

                        <h3 className="font-bold text-lg">
                            📄 Enhanced Contract Preview
                        </h3>

                        <p className="text-gray-500 mt-2">
                            This contract is updated as you accept AI suggestions.
                        </p>

                        <div className="mt-5 bg-gray-100 rounded-lg p-4 max-h-[500px] overflow-y-auto">

                            <pre className="whitespace-pre-wrap leading-7">
                                {enhancedContract}
                            </pre>

                        </div>
                        {enhancedContract !== contractText && (<div className="mt-5 text-center">
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
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                            >
                                ⬇ Download Enhanced DOCX
                            </button>
                        </div>)}
                    </div>

                </div>
            )}
            <div>


            </div>
        </div>
    );
}

export default UploadBox;