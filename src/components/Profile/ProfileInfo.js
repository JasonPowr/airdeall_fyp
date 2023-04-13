import {useContext, useEffect, useState} from "react";
import {auth} from "../../firebase";
import {Button} from "@material-ui/core";
import UserContext from "../../contexts/Auth/authContext";
import EnterPasswordPopup from "../Popup/EnterPasswordPopup/EnterPasswordPopup";

export function ProfileInfo() {
    const {sendResetEmail, reAuthWithCredential} = useContext(UserContext)
    const [user, setUser] = useState(null);
    const [isEmailUser, setIsEmailUser] = useState(false);

    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [returnedPassword, setReturnedPassword] = useState("");

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
                <div>
                    <p>name: {user.displayName}</p>
                    <p>email: {user.email}</p>
                    <p>Phone Number: {user.phoneNumber ? user.phoneNumber : "Phone Number not verified"}</p>
                    {isEmailUser && (
                        <div>
                            <Button onClick={handleChangePassword}>Change Password</Button>
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