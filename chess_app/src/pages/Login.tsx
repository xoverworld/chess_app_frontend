import {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { user, login }: any = useAuth()

    useEffect(() => {
        if(user)
        {
            navigate("/")
        }
    },[user])

    const handleLogin = async () => {
        try{
            await login(username,password)
            navigate("/")
        }
        catch(error){
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-center p-4 mt-20">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400 mt-2">Sign in to resume your game</p>
                </div>
                <div className="flex flex-col space-y-5">
                    <div>
                        <label className="text-sm font-medium text-slate-300 block mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="magnus@carlsen.com"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="text-sm font-medium text-slate-300 block mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                </div>

                {/* Footer Link */}
                <div className="mt-8 text-center">
                    <p className="text-slate-400">
                        New to the board?{" "}
                        <Link to='/register' className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;