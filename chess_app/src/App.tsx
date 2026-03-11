import './App.css'
import Home from './pages/Home.tsx'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Room from "./pages/Room.tsx";
import Nav from "./components/Nav.tsx";
import Profile from "./pages/Profile.tsx";
import {AuthProvider, useAuth} from "./context/AuthContext.tsx";
import * as React from "react";


function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading }: any = useAuth()
    if (loading) return (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'80vh'}}>
            <div className="spinner" style={{width:40,height:40,borderWidth:3}} />
        </div>
    )
    if (!user) return <Navigate to="/login" replace />
    return children
}


function App() {

    return (
        // min-h-screen ensures the background covers the whole page even if content is short
        <div className="min-h-250 bg-slate-950 flex flex-col text-white">
            <BrowserRouter>
                <AuthProvider>
                {/* Navigation Bar */}
                    <Nav />

                    {/* Main Content Area */}
                    <main className="grow flex flex-col">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/game/:gameId" element={<ProtectedRoute><Room /> </ProtectedRoute>} />
                            <Route path="/profile/:room" element={ <ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </AuthProvider>
            </BrowserRouter>
        </div>
    )
}
export default App;