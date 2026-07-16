import { useState } from "react";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import {
    Document,
    Packer,
    Paragraph,
    HeadingLevel,
    TextRun,
} from "docx";

function Generator() {
    const [contractType, setContractType] = useState("");

    const [formData, setFormData] = useState({
        // Service Agreement
        clientName: "",
        providerName: "",
        services: "",
        startDate: "",
        duration: "",
        payment: "",

        // Employment Agreement
        employeeName: "",
        companyName: "",
        jobTitle: "",
        joiningDate: "",
        salary: "",

        // NDA
        partyOne: "",
        partyTwo: "",
        purpose: "",
        confidentialPeriod: "",

        // Rental Agreement
        landlord: "",
        tenant: "",
        propertyAddress: "",
        monthlyRent: "",
        leaseDuration: "",

        // Freelancer Agreement
        freelancerName: "",
        projectDescription: "",
        projectDuration: "",
        projectPayment: "",
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const [generatedContract, setGeneratedContract] = useState("");
    const requiredFields = {
        "Service Agreement": [
            "clientName",
            "providerName",
            "services",
            "startDate",
            "duration",
            "payment",
        ],

        "Employment Agreement": [
            "employeeName",
            "companyName",
            "jobTitle",
            "joiningDate",
            "salary",
        ],

        "Non-Disclosure Agreement": [
            "partyOne",
            "partyTwo",
            "purpose",
            "confidentialPeriod",
        ],

        "Rental Agreement": [
            "landlord",
            "tenant",
            "propertyAddress",
            "monthlyRent",
            "leaseDuration",
        ],

        "Freelancer Agreement": [
            "clientName",
            "freelancerName",
            "projectDescription",
            "projectDuration",
            "projectPayment",
        ],
    };
    const handleGenerate = async () => {
        if (!contractType) {
            alert("Please select a contract type.");
            return;
        }

        const fields = requiredFields[contractType];

        for (const field of fields) {
            if (!formData[field]?.trim()) {
                alert(`Please fill the ${field} field.`);
                return;
            }
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contractType,
                    ...formData,
                }),
            });

            const data = await response.json();

            console.log(data);

            setGeneratedContract(data.contract);
        } catch (error) {
            console.error(error);
            alert("Error connecting to backend");
        }
    };
    const downloadPDF = () => {
        const doc = new jsPDF({
            unit: "mm",
            format: "a4",
        });

        // Title
        doc.setFont("times", "bold");
        doc.setFontSize(18);
        doc.text("Generated Contract", 20, 20);

        // Contract Content
        doc.setFont("times", "normal");
        doc.setFontSize(12);

        const pageWidth = 170;
        const pageHeight = 297;
        const marginTop = 35;
        const marginBottom = 20;
        const lineHeight = 7;

        const lines = doc.splitTextToSize(generatedContract, pageWidth);

        let y = marginTop;

        lines.forEach((line) => {
            if (y > pageHeight - marginBottom) {
                doc.addPage();
                y = 20;
            }

            doc.text(line, 20, y);
            y += lineHeight;
        });

        doc.save("Generated_Contract.pdf");
    };
    const downloadDOCX = async () => {
        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            heading: HeadingLevel.HEADING_1,
                            children: [
                                new TextRun({
                                    text: "Generated Contract",
                                    bold: true,
                                    size: 32,
                                }),
                            ],
                        }),

                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: generatedContract,
                                    size: 24,
                                }),
                            ],
                        }),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);

        saveAs(blob, "Generated_Contract.docx");
    };


    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-xl p-10 w-[700px]">
                    <h1 className="text-4xl font-bold text-blue-700 text-center">
                        Contract Generator
                    </h1>

                    <p className="mt-4 text-gray-600 text-center">
                        Generate professional legal contracts using AI.
                    </p>

                    <div className="mt-8">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Select Contract Type
                        </label>

                        <select
                            value={contractType}
                            onChange={(e) => {
                                setContractType(e.target.value);
                                setGeneratedContract("");
                            }}
                            className="w-full border rounded-lg p-3"
                        >
                            <option value="">-- Select --</option>
                            <option value="Service Agreement">
                                Service Agreement
                            </option>
                            <option value="Employment Agreement">
                                Employment Agreement
                            </option>
                            <option value="Non-Disclosure Agreement">
                                Non-Disclosure Agreement (NDA)
                            </option>
                            <option value="Rental Agreement">
                                Rental Agreement
                            </option>
                            <option value="Freelancer Agreement">
                                Freelancer Agreement
                            </option>
                        </select>
                    </div>
                    {contractType === "Service Agreement" && (
                        <div className="mt-8 space-y-4">
                            <input
                                type="text"
                                name="clientName"
                                placeholder="Client Name"
                                value={formData.clientName}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="providerName"
                                placeholder="Service Provider Name"
                                value={formData.providerName}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="services"
                                placeholder="Services Provided"
                                value={formData.services}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="duration"
                                placeholder="Contract Duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="payment"
                                placeholder="Payment Amount"
                                value={formData.payment}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>
                    )}
                    {contractType === "Employment Agreement" && (
                        <div className="mt-8 space-y-4">
                            <input
                                type="text"
                                name="employeeName"
                                placeholder="Employee Name"
                                value={formData.employeeName || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="companyName"
                                placeholder="Company Name"
                                value={formData.companyName || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="jobTitle"
                                placeholder="Job Title"
                                value={formData.jobTitle || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="salary"
                                placeholder="Annual Salary"
                                value={formData.salary || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>
                    )}
                    {contractType === "Non-Disclosure Agreement" && (
                        <div className="mt-8 space-y-4">
                            <input
                                type="text"
                                name="partyOne"
                                placeholder="First Party"
                                value={formData.partyOne || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="partyTwo"
                                placeholder="Second Party"
                                value={formData.partyTwo || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="purpose"
                                placeholder="Purpose of NDA"
                                value={formData.purpose || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="confidentialPeriod"
                                placeholder="Confidentiality Period"
                                value={formData.confidentialPeriod || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>
                    )}
                    {contractType === "Rental Agreement" && (
                        <div className="mt-8 space-y-4">
                            <input
                                type="text"
                                name="landlord"
                                placeholder="Landlord Name"
                                value={formData.landlord || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="tenant"
                                placeholder="Tenant Name"
                                value={formData.tenant || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="propertyAddress"
                                placeholder="Property Address"
                                value={formData.propertyAddress || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="monthlyRent"
                                placeholder="Monthly Rent"
                                value={formData.monthlyRent || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="leaseDuration"
                                placeholder="Lease Duration"
                                value={formData.leaseDuration || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>
                    )}
                    {contractType === "Freelancer Agreement" && (
                        <div className="mt-8 space-y-4">
                            <input
                                type="text"
                                name="clientName"
                                placeholder="Client Name"
                                value={formData.clientName || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="freelancerName"
                                placeholder="Freelancer Name"
                                value={formData.freelancerName || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="projectDescription"
                                placeholder="Project Description"
                                value={formData.projectDescription || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="projectDuration"
                                placeholder="Project Duration"
                                value={formData.projectDuration || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                name="projectPayment"
                                placeholder="Project Payment"
                                value={formData.projectPayment || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>
                    )}


                    {contractType && (
                        <div className="mt-6">
                            <button
                                onClick={handleGenerate}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                            >
                                Generate {contractType}
                            </button>
                        </div>
                    )}
                    {generatedContract && (
                        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold text-blue-700 mb-4">
                                Generated Contract
                            </h2>

                            <div className="flex justify-end gap-4 mb-4">
                                <button
                                    onClick={downloadPDF}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                                >
                                    Download PDF
                                </button>

                                <button
                                    onClick={downloadDOCX}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                                >
                                    Download DOCX
                                </button>
                            </div>

                            <div className="bg-white border rounded-lg shadow-inner p-8 max-h-[700px] overflow-y-auto">
                                <div className="whitespace-pre-wrap leading-8 text-gray-800 text-[15px]">
                                    {generatedContract}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Generator;