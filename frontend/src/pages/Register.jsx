import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Register() {

    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        full_name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async () => {

        if (
            !registerData.full_name ||
            !registerData.email ||
            !registerData.password
        ) {
            alert("Please fill in all fields.");
            return;
        }

        try {

            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful!");
                navigate("/login");
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
                        Create Account
                    </h1>

                    <p className="text-center text-gray-500 mt-2">
                        Join AccordAI today
                    </p>
                    <div className="mt-8 space-y-4">

                        <input
                            type="text"
                            name="full_name"
                            placeholder="Full Name"
                            value={registerData.full_name}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={registerData.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={registerData.password}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />

                    </div>
                    <div className="mt-6">
                        <button
                            onClick={handleRegister}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                        >
                            Create Account
                        </button>
                    </div>



                </div>

            </div>
        </>
    );
}

export default Register;