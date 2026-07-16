import { Link, useNavigate } from "react-router-dom";
function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };
    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-700">
                    AccordAI
                </h1>

                <div className="flex items-center gap-4">

                    <Link
                        to="/"
                        className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                        Home
                    </Link>

                    <Link
                        to="/generator"
                        className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                        Generator
                    </Link>

                    {!isLoggedIn && (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-blue-600 font-medium"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="text-gray-700 hover:text-blue-600 font-medium"
                            >
                                Register
                            </Link>
                        </>
                    )}
                    {isLoggedIn && (
                        <span className="text-gray-700 font-medium">
                            Welcome, {user?.full_name}
                        </span>
                    )}

                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    )}

                </div>
            </div>
        </nav>
    );
}


export default Navbar;