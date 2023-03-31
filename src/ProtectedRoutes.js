import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import UserContext from "./contexts/Auth/authContext";

const ProtectedRoute = ({children}) => {
    const {user} = useContext(UserContext)

    if (!user) {
        return <Navigate to='/'/>;
    }
    return children;
};

export default ProtectedRoute;


//https://stackoverflow.com/questions/62378796/cannot-destructure-property-of-object-from-context