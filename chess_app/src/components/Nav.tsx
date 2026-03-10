import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";

function Nav() {

    const { user, logout }:any = useAuth()


    return (
        <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-row items-center shadow-md">
            <div className="flex-1 flex justify-start">
                <Link to="/" className="font-bold text-xl hover:text-blue-400 transition-colors">ChessApp</Link>
            </div>
            <div className="flex-1 flex justify-end gap-6">
                {user ? <><Link to='/profile' className="text-blue-300 hover:text-blue-500 cursor-pointer transition-colors font-bold">{user.username}</Link><div onClick={logout}  className="hover:text-blue-400 cursor-pointer transition-colors font-bold">Logout</div></> : <Link to="/login" className="hover:text-blue-400 transition-colors font-bold">Login</Link>}


            </div>
        </nav>
    )
}

export default Nav