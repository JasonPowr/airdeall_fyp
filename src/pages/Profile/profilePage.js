import "./profilePage.css"
import BottomNav from "../../components/bottomNav/bottomNav";
import {useContext, useState} from "react";
import {Button} from "@material-ui/core";
import UserContext from "../../contexts/Auth/authContext";
import {useNavigate} from "react-router-dom";

function ProfilePage() {
    const [tab, setTab] = useState(0)
    const {logOut} = useContext(UserContext)
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