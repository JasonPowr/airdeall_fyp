import {useContext, useEffect, useState} from "react";
import UserContext from "../../contexts/Auth/authContext";
import {useNavigate} from "react-router-dom";
import {Button, makeStyles} from "@material-ui/core";
import {auth} from "../../firebase";
import {AvatarImage} from "./AvatarImage";
import {ProfileInfo} from "./ProfileInfo";
import {Settings} from "./Settings";
import ConfirmationPopup from "../Popup/DeleteConfirmationPopup/ConfirmationPopup";
import Loading from "../Loading/Loading";

const useStyles = makeStyles({
    info_div: {
        border: "3px Solid White",
        borderRadius: "20px",
        margin: "auto",
        width: "80%",
        maxWidth: "400px"
    },
    button: {
        backgroundColor: 'white !important',
        color: 'black',
        fontFamily: 'Raleway',
        fontSize: '15px',
        width: '222px',
        textAlign: 'center',
        textDecoration: 'none',
        marginBottom: '5%',
    },
})

export default function ProfileComponent() {
    const {logOut, user} = useContext(UserContext)
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const [openConfirmationSignOutDialog, setOpenConfirmationSignOutDialog] = useState(false);
    const classes = useStyles();

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
                    <div className={classes.info_div}>
                        <AvatarImage size={175}/>
                        <ProfileInfo/>
                    </div>
                    <Settings/>
                    <Button className={classes.button} onClick={handleSignOut}><b>Sign Out</b></Button>

                    {openConfirmationSignOutDialog && (
                        <ConfirmationPopup openConfirmationDialog={openConfirmationSignOutDialog}
                                           setOpenConfirmationDialog={setOpenConfirmationSignOutDialog}
                                           handleConfirmation={handleSignOutAfterConf}
                                           context={"sign out"}/>
                    )}

                </div>
            ) : (
                <div>
                    <Loading/>
                </div>
            )}
        </div>
    );
}
