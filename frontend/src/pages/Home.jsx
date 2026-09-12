import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import { FiShield, FiZap, FiMessageSquare } from "react-icons/fi";

const features = [
    {
        icon: FiShield,
        title: "Risk Detection",
        description: "Flags risky clauses and scores overall contract risk instantly.",
    },
    {
        icon: FiZap,
        title: "AI Rewrites",
        description: "One-click clause rewrites that reduce risk while keeping intent.",
    },
    {
        icon: FiMessageSquare,
        title: "Ask Anything",
        description: "Chat with your contract to get plain-English answers.",
    },
];

function Home() {
    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-50">

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

                    {/* Page Header */}
                    <div className="mb-10 sm:mb-12">

                        <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs sm:text-sm font-medium text-white">
                            AI Legal Review
                        </span>

                        <h1 className="mt-5 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
                            Analyze Contracts Instantly
                        </h1>

                        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-7 sm:leading-8">
                            Upload a contract to identify risks, review key clauses, and generate AI-powered revisions.
                        </p>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {features.map(({ icon: Icon, title, description }) => (
                                <div
                                    key={title}
                                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                                >
                                    <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-blue-50 text-blue-600">
                                        <Icon size={17} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {title}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-5">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Upload Section */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-lg shadow-slate-100 p-5 sm:p-10">
                        <UploadBox />
                    </div>

                </div>

            </div>
        </>
    );
}

export default Home;
