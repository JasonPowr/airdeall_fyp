import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./pages/Home/homePage";
import LoginPage from "./pages/Login/login/loginPage";
import RegistrationPage from "./pages/Register/registrationPage";
import "./App.css"
import {makeStyles} from "@material-ui/core";
import AlertsPage from "./pages/Alerts/alertpage/alertPage";
import {AuthContextProvider} from "./contexts/Auth/authContext";
import ProtectedRoutes from "./ProtectedRoutes";
import CreateAlertPage from "./pages/Alerts/createAlertPage/createAlertPage";
import MapsPage from "./pages/Maps/mapsPage";
import ProfilePage from "./pages/Profile/profilePage";
import AlertViewPage from "./pages/Alerts/alertViewPage/alertViewPage";
import EditAlertPage from "./pages/Alerts/editAlertPage/editAlertPage";
import AlertHistoryViewPage from "./pages/Alerts/AlertHistoryViewPage/AlertHistoryViewPage";
import ConfirmPhoneNumberPage from "./pages/Login/ConfirmPhoneNumber/ConfirmPhoneNumberPage";
import {initializeFacebookSDK} from "./components/Socials/facebook/facebook";
import AccountExtraDetailsPage from "./pages/Login/AccountExtraDetails/AccountExtraDetailsPage";
import SafePointRegistrationPage from "./pages/Register/SafePointRegistration/SafePointRegistration";
import InfoPage from "./pages/Info/Infopage";

const useStyles = makeStyles({
    app: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        left: '0',
        top: '0',
        color: 'white',
        alignContent: "center",
        background: 'linear-gradient(180deg, rgba(45,6,52,1) 0%, rgba(142,0,185,1) 100%)'
    },
})

function App() {
    const classes = useStyles();
    initializeFacebookSDK()
    return (
        <AuthContextProvider>
            <Router>
                <div className={classes.app}>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegistrationPage/>}/>
                        <Route path="/register_safePoint" element={<SafePointRegistrationPage/>}/>
                        <Route path="/alerts" element={<ProtectedRoutes> <AlertsPage/></ProtectedRoutes>}/>
                        <Route path="/create_alert" element={<ProtectedRoutes> <CreateAlertPage/></ProtectedRoutes>}/>
                        <Route path="/maps" element={<ProtectedRoutes> <MapsPage/></ProtectedRoutes>}/>
                        <Route path="/info" element={<ProtectedRoutes> <InfoPage/></ProtectedRoutes>}/>
                        <Route path="/profile" element={<ProtectedRoutes> <ProfilePage/></ProtectedRoutes>}/>
                        <Route path="/:id/alert_view" element={<ProtectedRoutes> <AlertViewPage/></ProtectedRoutes>}/>
                        <Route path="/:id/edit_alert" element={<ProtectedRoutes> <EditAlertPage/></ProtectedRoutes>}/>
                        <Route path="/:id/alert_view/:id/history_view"
                               element={<ProtectedRoutes> <AlertHistoryViewPage/></ProtectedRoutes>}/>
                        <Route path="/confirmNumber"
                               element={<ProtectedRoutes> <ConfirmPhoneNumberPage/></ProtectedRoutes>}/>
                        <Route path="/extraDetails"
                               element={<ProtectedRoutes> <AccountExtraDetailsPage/></ProtectedRoutes>}/>
                    </Routes>
                </div>
            </Router>
        </AuthContextProvider>
    );
}

export default App;
