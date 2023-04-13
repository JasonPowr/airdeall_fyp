import {useContext, useEffect, useState} from "react";
import UserContext from "../../contexts/Auth/authContext";
import {useNavigate} from "react-router-dom";
import {Button} from "@material-ui/core";
import {auth} from "../../firebase";
import {AvatarImage} from "./AvatarImage";
import {ProfileInfo} from "./ProfileInfo";
import {Settings} from "./Settings";
import ConfirmationPopup from "../Popup/ConfirmationPopup/ConfirmationPopup";

export default function ProfileComponent() {
    const {logOut, user} = useContext(UserContext)
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const [openConfirmationSignOutDialog, setOpenConfirmationSignOutDialog] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
            }
        })
    }, []);

    function handleSignOut() {
        setOpenConfirmationSignOutDialog(true)
    }

    const handleSignOutAfterConf = (confirmation) => {
        if (confirmation) {
            try {
                logOut()
                navigate('/')
            } catch (e) {
                setError(e.message)
            }
        }
    }

    return (
        <div>
            {user ? (
                <div>
                    <h2> Your Profile </h2>
                    <AvatarImage size={175}/>
                    <ProfileInfo/>
                    <Settings/>
                    <Button onClick={handleSignOut}>Sign Out</Button>

                    {openConfirmationSignOutDialog && (
                        <ConfirmationPopup openConfirmationDialog={openConfirmationSignOutDialog}
                                           setOpenConfirmationDialog={setOpenConfirmationSignOutDialog}
                                           handleConfirmation={handleSignOutAfterConf}/>
                    )}

                </div>
            ) : (
                <div>
                    <>Loading ...</>
                </div>
            )}
        </div>
    );
}
