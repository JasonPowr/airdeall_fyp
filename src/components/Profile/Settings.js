import {useContext, useEffect, useState} from "react";
import {auth} from "../../firebase";
import {Button} from "@material-ui/core";
import UserContext from "../../contexts/Auth/authContext";
import {loginWithFacebook, logoutWithFacebook} from "../Socials/facebook/facebook";
import EnterPasswordPopup from "../Popup/EnterPasswordPopup/EnterPasswordPopup";
import ConfirmationPopup from "../Popup/ConfirmationPopup/ConfirmationPopup";
import {deleteUserData} from "../../model/db/DB";

export function Settings() {
    const [user, setUser] = useState(null);
    const {
        unlinkFacebookAccount,
        reAuthWithGoogle,
        reAuthWithCredential,
        deleteUserAccount
    } = useContext(UserContext)
    const [isFacebookLinked, setIsFacebookLinked] = useState(false);
    // const navigate = useNavigate()

    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [openConfirmationGoogleAuthDialog, setOpenConfirmationGoogleAuthDialog] = useState(false);
    const [openConfirmationUnlinkFacebookDialog, setOpenConfirmationUnlinkFacebookDialog] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user)
                user.providerData.map((index) => {
                    if (index.providerId === "facebook.com") {
                        setIsFacebookLinked(true)
                    }
                })
            }
        })
    }, [isFacebookLinked]);

    const handleFacebookLink = async () => {
        try {
            await loginWithFacebook()
            setIsFacebookLinked(true)
        } catch (error) {
            console.log(error)
        }
    }

    function handleFacebookUnlink() {
        setOpenConfirmationUnlinkFacebookDialog(true)
    }

    const handleFacebookUnlinkAfterConf = (confirmation) => {
        if (confirmation) {
            logoutWithFacebook()
            unlinkFacebookAccount()
            setIsFacebookLinked(false)
        }
    }

    const handleDeleteUser = () => {
        user.providerData.forEach((profile) => {
            if (profile.providerId === "password") {
                setOpenPasswordDialog(true)
            } else if (profile.providerId === "google.com") {
                setOpenConfirmationGoogleAuthDialog(true)
            }
        });
    }

    const handleDelete = async (confirmation) => {
        if (confirmation) {
            try {
                await deleteUserData()
                // deleteUserAccount()
            } catch (e) {
                console.log(e)
            }
        }
    };

    const handleGoogleAuth = (confirmation) => {
        if (confirmation) {
            try {
                reAuthWithGoogle()
                handleDelete(confirmation)
            } catch (e) {
                console.log(e)
            }
        }
    };

    const handleReturnedPassword = async (password) => {
        setOpenPasswordDialog(false);
        try {
            await reAuthWithCredential(password);
        } catch (e) {
            console.log(e);
        }
        setOpenConfirmationDialog(true);
    };

    return (
        <div>
            {user && (
                <div>
                    {isFacebookLinked ? (
                        <Button onClick={handleFacebookUnlink}>Unlink Facebook Account</Button>
                    ) : (
                        <Button onClick={handleFacebookLink}>Link Facebook Account</Button>
                    )}
                    <Button onClick={handleDeleteUser}>Delete Account</Button>

                    {openPasswordDialog && (
                        <EnterPasswordPopup
                            openPasswordDialog={openPasswordDialog}
                            setOpenPasswordDialog={setOpenPasswordDialog}
                            handleReturnedPassword={handleReturnedPassword}
                        />
                    )}

                    {openConfirmationDialog && (
                        <ConfirmationPopup openConfirmationDialog={openConfirmationDialog}
                                           setOpenConfirmationDialog={setOpenConfirmationDialog}
                                           handleConfirmation={handleDelete}/>
                    )}

                    {openConfirmationGoogleAuthDialog && (
                        <ConfirmationPopup openConfirmationDialog={openConfirmationGoogleAuthDialog}
                                           setOpenConfirmationDialog={setOpenConfirmationGoogleAuthDialog}
                                           handleConfirmation={handleGoogleAuth}/>
                    )}

                    {openConfirmationUnlinkFacebookDialog && (
                        <ConfirmationPopup openConfirmationDialog={openConfirmationUnlinkFacebookDialog}
                                           setOpenConfirmationDialog={setOpenConfirmationUnlinkFacebookDialog}
                                           handleConfirmation={handleFacebookUnlinkAfterConf}/>
                    )}
                </div>
            )}
        </div>
    )
}