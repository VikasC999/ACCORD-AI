import { useRef, useState } from "react";
import API_BASE_URL from "../services/api";

function UploadBox() {
    const fileInputRef = useRef(null);

    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

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

            setAnalysis(data.summary);
        } catch (error) {
            console.error(error);
            alert("Upload failed.");
        } finally {
            setLoading(false);
        }
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

                </div>
            )}
        </div>
    );
}

export default UploadBox;