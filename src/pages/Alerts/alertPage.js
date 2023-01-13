import {UserAuth} from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
function AlertsPage() {
    const { user, logOut } = UserAuth()
    const navigate = useNavigate()
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        try {
            logOut()
            navigate('/')
        }catch (e) {
            setError(e.message)
            console.log(e.message)
        }
    }
    return (
        <div>
            <p>Hello user: {user && user.email}</p>
            <button onClick={handleSubmit}>Sign Out</button>
        </div>
    );
}

export default AlertsPage;