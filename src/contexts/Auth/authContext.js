import React, {createContext, useEffect, useState} from 'react';
import {
    createUserWithEmailAndPassword,
    linkWithPhoneNumber,
    onAuthStateChanged,
    RecaptchaVerifier,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import {auth} from "../../firebase";

const UserContext = createContext();
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
            verifyCode
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
