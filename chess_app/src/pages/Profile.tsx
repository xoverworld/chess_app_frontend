import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";

function Profile() {
    const socketRef = useRef(null);
    const { room } = useParams();
    const [count, setCount] = useState(0);
    useEffect(() => {
        socketRef.current = new WebSocket(`/ws/ws/${room}`);

        socketRef.current.onmessage = (event) => {
            const messege = JSON.parse(event.data);

            if(messege.data === "one")
            {
                setCount((prevCount) => prevCount + 1);
            }
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        }
    },[room]);


    const handleSendMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                room: room,
                data: 'one'
            }));
        }
    }
    return (
        <>
            <div>
                <div>{room}</div>
                <div>{count}</div>
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </>
    )
}

export default Profile