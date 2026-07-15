function Navbar() {
    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-700">
                    AccordAI
                </h1>

                <span className="text-gray-500">
                    AI Contract Assistant
                </span>
            </div>
        </nav>
    );
}

export default Navbar;