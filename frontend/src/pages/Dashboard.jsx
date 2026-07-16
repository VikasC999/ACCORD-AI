import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
    const [contracts, setContracts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {

        const fetchContracts = async () => {

            try {

                const token = localStorage.getItem("token");
                console.log("Token:", token);

                const response = await fetch("http://127.0.0.1:5000/my-contracts", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                console.log(data);

                setContracts(data);

            } catch (error) {
                console.error(error);
            }
        };

        fetchContracts();

    }, []);
    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 p-8">

                <h1 className="text-4xl font-bold text-blue-700">
                    Dashboard
                </h1>

                <p className="text-gray-600 mt-2">
                    Welcome to your AccordAI Dashboard
                </p>

                <div className="mt-10 space-y-4">

                    {contracts.length === 0 ? (

                        <p className="text-gray-500">
                            No contracts found.
                        </p>

                    ) : (

                        contracts.map((contract) => (

                            <div
                                key={contract.id}
                                className="bg-white rounded-xl shadow-md p-6 border"
                            >

                                <h2 className="text-xl font-bold text-blue-700">
                                    {contract.title}
                                </h2>

                                <p className="mt-2 text-gray-600">
                                    Type: {contract.contract_type}
                                </p>

                                <p className="text-gray-600">
                                    Mode: {contract.mode}
                                </p>

                                <p className="text-gray-600">
                                    Created: {contract.created_at}
                                </p>
                                <div className="mt-4">
                                    <button
                                        onClick={() => navigate(`/contract/${contract.id}`)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        View
                                    </button>
                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>
        </>
    );
}

export default Dashboard;