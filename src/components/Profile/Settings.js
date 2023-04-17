import {useContext, useEffect, useState} from "react";
import {auth} from "../../firebase";
import {Button, makeStyles} from "@material-ui/core";
import UserContext from "../../contexts/Auth/authContext";
import {loginWithFacebook, logoutWithFacebook} from "../Socials/facebook/facebook";
import EnterPasswordPopup from "../Popup/EnterPasswordPopup/EnterPasswordPopup";
import ConfirmationPopup from "../Popup/DeleteConfirmationPopup/ConfirmationPopup";
import {deleteUserData} from "../../model/db/DB";
import {FacebookLoginButton} from "react-social-login-buttons";

const useStyles = makeStyles({
    facebook_Btn: {
        width: "80%",
        maxWidth: "400px",
        paddingTop: "20px",
        margin: "auto"
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
        marginBottom: '2%',
    },
})

export function Settings() {
    const [user, setUser] = useState(null);
    const {
        unlinkFacebookAccount,
        reAuthWithGoogle,
        reAuthWithCredential,
        deleteUserAccount
    } = useContext(UserContext)
    const [isFacebookLinked, setIsFacebookLinked] = useState(false);
    const classes = useStyles();

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
                deleteUserAccount()
            } catch (e) {
                console.log(e)
            }
        }
    };

    const handleGoogleAuth = async (confirmation) => {
        if (confirmation) {
            try {
                reAuthWithGoogle()
                await handleDelete(confirmation)
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

                    <div className={classes.facebook_Btn}>
                        {isFacebookLinked ? (
                            <FacebookLoginButton onClick={handleFacebookUnlink}>Unlink Facebook
                                Account</FacebookLoginButton>
                        ) : (
                            <FacebookLoginButton onClick={handleFacebookLink}>Link Facebook
                                Account</FacebookLoginButton>
                        )}
                    </div>

                    <Button className={classes.button} onClick={handleDeleteUser}><b>Delete Account</b></Button>

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
                                           handleConfirmation={handleDelete}
                                           context={"delete your Account"}/>
                    )}

                    {openConfirmationGoogleAuthDialog && (
                        <ConfirmationPopup openConfirmationDialog={openConfirmationGoogleAuthDialog}
                                           setOpenConfirmationDialog={setOpenConfirmationGoogleAuthDialog}
                                           handleConfirmation={handleGoogleAuth}
                                           context={"delete your Account"}/>
                    )}

                    {openConfirmationUnlinkFacebookDialog && (
                        <ConfirmationPopup openConfirmationDialog={openConfirmationUnlinkFacebookDialog}
                                           setOpenConfirmationDialog={setOpenConfirmationUnlinkFacebookDialog}
                                           handleConfirmation={handleFacebookUnlinkAfterConf}
                                           context={"unlink your Facebook Account"}/>
                    )}
                </div>
            )}
        </div>
    )
}