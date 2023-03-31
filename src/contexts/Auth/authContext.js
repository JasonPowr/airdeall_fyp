/*@formatter:off*/
import React, {createContext, useEffect, useState} from 'react';
import {createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {auth} from "../../firebase";

const UserContext = createContext();
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

    const userId = () => {
        return auth.currentUser.uid
    }

    const sendResetEmail = (email) => {
        return sendPasswordResetEmail(auth, email)
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
        <UserContext.Provider value={{ createUser, user, logOut, logIn, userId, sendResetEmail }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
