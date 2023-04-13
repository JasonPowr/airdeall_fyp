import React, {createContext, useEffect, useState} from 'react';
import {
    createUserWithEmailAndPassword,
    deleteUser,
    EmailAuthProvider,
    getRedirectResult,
    GoogleAuthProvider,
    linkWithPhoneNumber,
    linkWithRedirect,
    onAuthStateChanged,
    reauthenticateWithCredential,
    reauthenticateWithRedirect,
    RecaptchaVerifier,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithRedirect,
    signOut,
    unlink
} from 'firebase/auth';
import {auth} from "../../firebase";

const UserContext = createContext();
const GoogleProvider = new GoogleAuthProvider();
let confirmCode = null

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({})
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    };

    const logOut = () => {
        return signOut(auth)
    };

    const logIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const sendResetEmail = (email) => {
        return sendPasswordResetEmail(auth, email)
    }

    const sendVerifyEmailAddress = () => {
        return sendEmailVerification(auth.currentUser)
    }

    const sendVerificationSMS = (phoneNumber, submitButtonId) => {
        window.recaptchaVerifier = new RecaptchaVerifier(submitButtonId, {
            'size': 'invisible',
        }, auth);

        linkWithPhoneNumber(user, phoneNumber, window.recaptchaVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                confirmCode = confirmationResult
            }).catch((error) => {
            console.log(error)
        });

    }

    const verifyCode = (code) => {
        return confirmCode.confirm(code)
    }

    const loginWithGoogle = async () => {
        return signInWithRedirect(auth, GoogleProvider);
    }

    const linkAccountWithGoogle = async () => {
        return linkWithRedirect(auth, GoogleProvider);
    }

    const unlinkFacebookAccount = () => {
        return unlink(auth.currentUser, "facebook.com")
    }

    const deleteUserAccount = () => {
        return deleteUser(auth.currentUser)
    }


    const reAuthWithGoogle = () => {
        return reauthenticateWithRedirect(auth.currentUser, GoogleProvider)
    }

    const getRedirectResults = () => {
        return getRedirectResult(auth)
    }

    const reAuthWithCredential = async (password) => {
        const credential = await EmailAuthProvider.credential(user.email, password)
        reauthenticateWithCredential(user, credential).then(() => {
        });
        //https://stackoverflow.com/questions/69186075/error-with-reauthenticatewithcredential-get-error-typeerror-credential-getreau
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{
            createUser,
            user,
            logOut,
            logIn,
            sendResetEmail,
            sendVerifyEmailAddress,
            sendVerificationSMS,
            verifyCode,
            loginWithGoogle,
            linkAccountWithGoogle,
            unlinkFacebookAccount,
            deleteUserAccount,
            reAuthWithCredential,
            reAuthWithGoogle,
            getRedirectResults,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
