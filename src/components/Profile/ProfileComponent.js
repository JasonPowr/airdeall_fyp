import {useContext, useState} from "react";
import UserContext from "../../contexts/Auth/authContext";
import {useNavigate} from "react-router-dom";
import {Button} from "@material-ui/core";

export default function ProfileComponent() {
    const {logOut, user} = useContext(UserContext)
    const navigate = useNavigate()
    const [error, setError] = useState("");

    function handleSignOut() {
        try {
            logOut()
            navigate('/')
        } catch (e) {
            setError(e.message)
        }
    }

    return (
        <div>
            {user ? (
                <div>
                    <p> Your Profile </p>
                    <p>Email</p>
                    <p>{user.email}</p>
                    <Button onClick={handleSignOut}>Sign Out</Button>
                </div>
            ) : (
                <div>
                    <>Loading ...</>
                </div>
            )}
        </div>
    );
}
