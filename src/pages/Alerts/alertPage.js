import {UserAuth} from "../../contexts/authContext";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {Button} from "@material-ui/core";
import AlertCard from "../../components/Cards/AlertCard";
function AlertsPage() {
    const { user, logOut } = UserAuth()
    const navigate = useNavigate()
    const [error, setError] = useState("");

    if(user != null){
        console.log(user)
    }

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
            <p>Hello user: {user && user.displayName}</p>
            <AlertCard/>
            <Link to={"/create_alert"}><Button>Create Alert</Button></Link>
            <Button onClick={handleSubmit}>Sign Out</Button>
        </div>
    );
}

export default AlertsPage;