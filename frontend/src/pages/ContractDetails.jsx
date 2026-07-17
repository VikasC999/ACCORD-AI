import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function ContractViewer() {
    const { id } = useParams();

    const [contract, setContract] = useState(null);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://127.0.0.1:5000/contract/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();
                setContract(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchContract();
    }, [id]);

    const downloadPDF = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://127.0.0.1:5000/download-pdf/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                alert("Failed to download PDF.");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${contract.title}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Download failed.");
        }
    };

    const downloadDocx = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://127.0.0.1:5000/download-docx/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                alert("Failed to download DOCX.");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${contract.title}.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Download failed.");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(contract.content);
        alert("Contract copied to clipboard!");
    };

    const handlePrint = () => {
        window.print();
    };

    if (!contract) {
        return <p className="p-10">Loading...</p>;
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 p-8">
                <div className="bg-white rounded-xl shadow-lg p-8">

                    <h1 className="text-3xl font-bold text-blue-700">
                        {contract.title}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {contract.contract_type}
                    </p>

                    <hr className="my-6" />

                    <div className="flex flex-wrap gap-3">

                        <button
                            onClick={downloadPDF}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                        >
                            Download PDF
                        </button>

                        <button
                            onClick={downloadDocx}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                        >
                            Download DOCX
                        </button>

                        <button
                            onClick={handleCopy}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg"
                        >
                            Copy
                        </button>

                        <button
                            onClick={handlePrint}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
                        >
                            Print
                        </button>

                    </div>

                    <div className="mt-8 bg-gray-50 border rounded-xl p-8 whitespace-pre-wrap leading-8 text-gray-800 font-serif">
                        {contract.content}
                    </div>

                </div>
            </div>
        </>
    );
}

export default ContractViewer;