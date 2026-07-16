import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/");
        }
    }, [navigate]);
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async () => {

        if (!loginData.email || !loginData.password) {
            alert("Please fill in all fields.");
            return;
        }

        try {

            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                navigate("/");

            } else {

                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Unable to connect to server.");
        }
    };
    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-xl p-10 w-[450px]">

                    <h1 className="text-3xl font-bold text-blue-700 text-center">
                        Login
                    </h1>

                    <p className="text-center text-gray-500 mt-2">
                        Login to your AccordAI account
                    </p>
                    <div className="mt-8 space-y-4">

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={loginData.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />

                    </div>
                    <div className="mt-6">
                        <button
                            onClick={handleLogin}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                        >
                            Login
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Login;