import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiFileText, FiMenu, FiX, FiLogOut } from "react-icons/fi";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isLoggedIn = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const navLinks = [
        { to: "/", label: "Analyze" },
        { to: "/generator", label: "Generate" },
        { to: "/dashboard", label: "My Contracts" },
    ];

    const isActive = (to) => location.pathname === to;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 text-white">
                            <FiFileText size={18} />
                        </span>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Accord<span className="text-blue-600">AI</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive(link.to)
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition"
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-slate-100">
                                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-semibold">
                                        {(user?.full_name || "U").charAt(0).toUpperCase()}
                                    </span>
                                    <span className="text-sm font-medium text-slate-700 max-w-[140px] truncate">
                                        {user?.full_name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    title="Logout"
                                    className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                                >
                                    <FiLogOut size={18} />
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                        {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>

                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className={`block px-4 py-3 rounded-lg text-sm font-medium ${isActive(link.to)
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="pt-2 mt-2 border-t border-slate-200">
                        {!isLoggedIn ? (
                            <div className="flex flex-col gap-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="px-4 py-3 rounded-lg text-sm font-semibold bg-blue-600 text-white text-center"
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between px-4 py-2">
                                <span className="text-sm font-medium text-slate-700">
                                    {user?.full_name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 text-sm font-medium text-red-600"
                                >
                                    <FiLogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
