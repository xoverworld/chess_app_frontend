import './App.css'
import Home from './components/Home.tsx'
import { BrowserRouter, Routes, Route, Link  } from "react-router-dom"
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import Room from "./components/Room.tsx";

function App() {
    return (
        // min-h-screen ensures the background covers the whole page even if content is short
        <div className="min-h-250 bg-slate-950 flex flex-col text-white">
            <BrowserRouter>
                {/* Navigation Bar */}
                <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-row items-center shadow-md">
                    <div className="flex-1 flex justify-start">
                        <Link to="/" className="font-bold text-xl hover:text-blue-400 transition-colors">ChessApp</Link>
                    </div>
                    <div className="flex-1 flex justify-end gap-6">
                        <Link to="/login" className="hover:text-blue-400 transition-colors font-bold">Login</Link>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="grow flex flex-col">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/room" element={<Room />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </div>
    )
}
export default App;