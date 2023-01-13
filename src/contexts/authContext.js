import {createContext, useContext, useEffect, useState} from 'react';
import {createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebase';

const UserContext = createContext();

export const AuthContextProvider = ({children}) =>{
    const [user, setUser] = useState({})
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        return signOut(auth)
    };

    const logIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    useEffect(() => {
        return onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
    }, [])

    return (
        <UserContext.Provider value={{ createUser, user, logOut, logIn }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(UserContext);
};
