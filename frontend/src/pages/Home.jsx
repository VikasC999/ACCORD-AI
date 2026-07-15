import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
function Home() {
    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-xl p-10 w-[600px] text-center">
                    <h1 className="text-4xl font-bold text-blue-700">
                        AccordAI
                    </h1>

                    <p className="mt-4 text-gray-600">
                        AI-Powered Contract Analysis & Generation
                    </p>

                    <UploadBox />
                </div>
            </div>
        </>
    );
}

export default Home;