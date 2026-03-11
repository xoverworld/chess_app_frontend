import { useNavigate} from "react-router-dom";
import { useAuth} from "../context/AuthContext.tsx";
import {useEffect, useRef, useState} from "react";

function Home() {

    const navigate = useNavigate();
    const { user }: any = useAuth();
    const socketRef = useRef(null);
    const [matchmaking, setMatchmaking] = useState(false);
    const [privateGame, setPrivateGame] = useState(false);
    const [botGame, setBotGame] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (matchmaking) {
            socketRef.current = new WebSocket('/ws/matchmaking')

            socketRef.current.onmessage = (e) => {
                const message = JSON.parse(e.data);
                if(message.type === "waiting")
                {
                    setMessage(message.message);
                }
                if(message.type === "match_found")
                {
                    navigate(`/game/${message.gameId}?reversed=${message.reversed}`);
                }
            }

            return () => {
                if (socketRef.current) {
                    socketRef.current.close();
                }
            }
        }
    }, [matchmaking]);
    const handleMatchmaking = () => {
        if(!user){
            navigate("/login");
        }
        setMatchmaking(true);
    }

    const handlePrivateGame = () => {
        if(!user){
            navigate("/login");
        }
        setPrivateGame(true);
    }

    const handleBotGame = () => {
        if(!user){
            navigate("/login");
        }
        setBotGame(true);
    }
    return (
        <>
            <div className="">{message}</div>
        <div className="flex flex-row gap-20 justify-center items-center mt-50 text-blue-200">
            <button onClick={handleMatchmaking}>
                <div className="card border-2 rounded-3xl w-50 flex flex-col justify-center items-center hover:text-blue-400 hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-15 mb-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    Play Online
                </div>
            </button>
            <button onClick={handlePrivateGame}>
                <div className="card border-2 rounded-3xl w-50 flex flex-col justify-center items-center hover:text-blue-400 hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-15 mb-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    Play with a Friend
                </div>
            </button>
            <button onClick={handleBotGame}>
                <div className="card border-2 rounded-3xl w-50 flex flex-col justify-center items-center hover:text-blue-400 hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-15 mb-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
                    </svg>
                    Play against Bots
                </div>
            </button>
        </div>
        </>
    )
}

export default Home