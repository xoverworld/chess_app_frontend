import { Link } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const handleRegister = async () => {
        if (password === repeatPassword) {
            try{
                const response = await axios.post("http://localhost:8000/register",
                    {
                        username: username,
                        email: email,
                        password: password,
                    })

                console.log(response.data);
            }
            catch(error){
                console.log(error);
            }
        }
    };

    return (
        /* h-full ensures it fills the space under the fixed Navbar in App.tsx */
        <div className="h-full w-full flex items-center justify-center p-4 mt-20 bg-slate-950">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                    <p className="text-slate-400 mt-2">Join the chess community today</p>
                </div>

                <div className="flex flex-col space-y-4">
                    {/* Username */}
                    <div>
                        <label className="text-sm font-medium text-slate-300 block mb-1">Username</label>
                        <input
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-slate-300 block mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-slate-300 block mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Repeat Password */}
                    <div>
                        <label className="text-sm font-medium text-slate-300 block mb-1">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="••••••••"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 mt-4 rounded-lg shadow-lg transition-all active:scale-[0.98]"
                        onClick={handleRegister}
                    >
                        Register
                    </button>

                    <p className="text-center mt-6 text-slate-400">
                        Already have an account?{" "}
                        <Link to='/login' className="text-blue-400 hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;