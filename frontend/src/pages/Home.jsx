import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";

function Home() {
    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-50">

                <div className="max-w-5xl mx-auto px-8 py-16">

                    {/* Page Header */}
                    <div className="mb-12">

                        <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white">
                            AI Legal Review
                        </span>

                        <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-900">
                            Analyze Contracts Instantly
                        </h1>

                        <p className="mt-4 text-lg text-slate-600 max-w-2xl leading-8">
                            Upload a contract to identify risks, review key clauses, and generate AI-powered revisions.
                        </p>

                    </div>

                    {/* Upload Section */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100 p-10">
                        <UploadBox />
                    </div>

                </div>

            </div>
        </>
    );
}

export default Home;