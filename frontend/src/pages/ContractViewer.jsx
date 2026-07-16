import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function ContractViewer() {

    const { id } = useParams();

    const [contract, setContract] = useState(null);
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
                alert("Failed to download contract.");
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

    useEffect(() => {

        const fetchContract = async () => {

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
        };

        fetchContract();

    }, [id]);

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
                    <div className="flex gap-4 mb-6">

                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                        >
                            Download PDF
                        </button>
                        <button
                            onClick={downloadDocx}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                        >
                            Download DOCX
                        </button>

                    </div>

                    <pre className="whitespace-pre-wrap leading-8 text-gray-700">
                        {contract.content}
                    </pre>

                </div>

            </div>
        </>
    );
}

export default ContractViewer;