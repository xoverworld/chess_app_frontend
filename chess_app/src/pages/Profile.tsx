import {useAuth} from "../context/AuthContext.tsx";

function Profile() {
    const {user}: any = useAuth()
    return (
        <>
            <div>
                <div>{user.username}</div>
            </div>
        </>
    )
}

export default Profile