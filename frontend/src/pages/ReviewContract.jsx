import Navbar from "../components/Navbar";

function ReviewContract() {

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 p-8">

                <h1 className="text-4xl font-bold text-blue-700">
                    AI Contract Review
                </h1>

                <p className="text-gray-600 mt-2">
                    Review risky clauses and improve your agreement using AI.
                </p>

            </div>
        </>
    );
}

export default ReviewContract;
