import "./profilePage.css"
import BottomNav from "../../components/bottomNav/bottomNav";
import {useState} from "react";
import {Button} from "@material-ui/core";
import {UserAuth} from "../../contexts/Auth/authContext";
import {useNavigate} from "react-router-dom";

function ProfilePage() {
    const [tab, setTab] = useState(0)
    const {logOut} = UserAuth()
    const navigate = useNavigate()
    const [error, setError] = useState("");

    function handleSignOut() {
        try {
            logOut()
            navigate('/')
        } catch (e) {
            setError(e.message)
            console.log(error)
        }
    }

    return (
        <div>
            <p>Profile Page</p>
            <Button onClick={handleSignOut}>Sign Out</Button>
            <BottomNav value={tab} onChange={setTab}/>
        </div>
    );
}

export default ProfilePage;