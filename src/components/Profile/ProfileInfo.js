import {useContext, useEffect, useState} from "react";
import {auth} from "../../firebase";
import {Button, makeStyles} from "@material-ui/core";
import UserContext from "../../contexts/Auth/authContext";
import EnterPasswordPopup from "../Popup/EnterPasswordPopup/EnterPasswordPopup";
import {Email, Phone, SupervisedUserCircle} from "@material-ui/icons";

const useStyles = makeStyles({
    info_div: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    button: {
        marginTop: '20px',
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

export function ProfileInfo() {
    const {sendResetEmail, reAuthWithCredential} = useContext(UserContext)
    const [user, setUser] = useState(null);
    const [isEmailUser, setIsEmailUser] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [returnedPassword, setReturnedPassword] = useState("");
    const classes = useStyles();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user)
                user.providerData.forEach((profile) => {
                    if (profile.providerId === "password") {
                        setIsEmailUser(true)
                    }
                });
            }
        })
    }, []);

    function handleChangePassword() {
        setOpenPasswordDialog(true)
    }

    const handleReturnedPassword = async (password) => {
        setReturnedPassword(password);
        setOpenPasswordDialog(false);

        try {
            await reAuthWithCredential(returnedPassword)
        } catch (e) {
            console.log(e)
        }

        try {
            await sendResetEmail(user.email)
        } catch (e) {
            console.log(e)
        }

    };

    return (
        <div>
            {user && (
                <div className={classes.info_div}>
                    <p>{user.displayName} <SupervisedUserCircle/></p>
                    <p>{user.email} <Email/></p>
                    <p>{user.phoneNumber ? user.phoneNumber : "Phone Number not verified"} <Phone/></p>
                    {isEmailUser && (
                        <div>
                            <Button className={classes.button} onClick={handleChangePassword}><b>Change
                                Password</b></Button>
                            {openPasswordDialog && (
                                <EnterPasswordPopup
                                    openPasswordDialog={openPasswordDialog}
                                    setOpenPasswordDialog={setOpenPasswordDialog}
                                    handleReturnedPassword={handleReturnedPassword}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}


//https://www.npmjs.com/package/react-avatar