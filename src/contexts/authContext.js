import {createContext, useContext, useState} from 'react';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import {auth, db} from '../firebase';
import {doc, setDoc} from "firebase/firestore";

const UserContext = createContext();
export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({})
    const createUser = (email, password, firstName, lastName) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                updateProfile(auth.currentUser, {
                    displayName: firstName.toString() + " " + lastName.toString(),
                }).then(async () => {

                    await setDoc(doc(db, "users", `${auth.currentUser.uid}`), {
                        displayName: auth.currentUser.displayName,
                    });
                }).catch((error) => {
                    // An error occurred
                    // ...
                });
            })

            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    };

    const logOut = () => {
        return signOut(auth)
    };

    const logIn = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }


    onAuthStateChanged(auth, (currentUser) => {
        if (user) {
            setUser(currentUser)
        } else {
        }
    });

    return (
        <UserContext.Provider value={{createUser, user, logOut, logIn}}>
            {children}
        </UserContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(UserContext);
};
