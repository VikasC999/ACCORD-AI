import UploadBox from "./components/UploadBox";

function App() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[var(--text)]">
            AccordAI
          </h1>

          <p className="mt-4 text-lg text-[var(--text-light)]">
            AI-powered Contract Analysis & Generation
          </p>
        </div>

        {/* Upload Section */}
        <UploadBox />

      </div>
    </div>
  );
}

export default App;