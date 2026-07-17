import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
    const [contracts, setContracts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterMode, setFilterMode] = useState("All");

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
    const handleDelete = async (contractId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this contract?"
        );

        if (!confirmDelete) return;

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://127.0.0.1:5000/contract/${contractId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {

                setContracts((prev) =>
                    prev.filter((contract) => contract.id !== contractId)
                );

            } else {

                const data = await response.json();
                alert(data.message);

            }

        } catch (error) {

            console.error(error);
            alert("Failed to delete contract.");

        }
    };
    const filteredContracts = contracts.filter((contract) => {

        const matchesSearch =
            contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.contract_type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterMode === "All" || contract.mode === filterMode;

        return matchesSearch && matchesFilter;
    });
    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 py-10">
                <div className="max-w-6xl mx-auto px-6">

                    <div className="flex items-center justify-between mb-8">

                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                My Contracts
                            </h1>

                            <p className="text-gray-500 mt-2">
                                View, manage and organize all your analyzed and generated contracts.
                            </p>
                        </div>

                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-8">

                        <div className="flex flex-col md:flex-row gap-4">

                            <input
                                type="text"
                                placeholder="Search by title or contract type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <select
                                value={filterMode}
                                onChange={(e) => setFilterMode(e.target.value)}
                                className="border border-gray-300 rounded-xl px-4 py-3 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All Contracts</option>
                                <option value="Generated">Generated</option>
                                <option value="Analyzed">Analyzed</option>
                            </select>

                        </div>

                    </div>


                    <div className="mt-10 space-y-4">

                        {filteredContracts.length === 0 ? (

                            <p className="text-gray-500">
                                No contracts found.
                            </p>

                        ) : (

                            filteredContracts.map((contract) => (

                                <div
                                    key={contract.id}
                                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 p-6"
                                >
                                    <div className="flex justify-between items-start">

                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {contract.title}
                                            </h2>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {contract.contract_type}
                                            </p>
                                        </div>

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${contract.mode === "Generated"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {contract.mode}
                                        </span>

                                    </div>

                                    <div className="mt-6 flex items-center justify-between">

                                        <p className="text-sm text-gray-500">
                                            Created on {contract.created_at}
                                        </p>

                                        <div className="flex gap-3">

                                            <button
                                                onClick={() => navigate(`/contract/${contract.id}`)}
                                                className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() => handleDelete(contract.id)}
                                                className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>
            </div>
        </>
    );
}

export default Dashboard;