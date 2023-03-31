import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./pages/Home/homePage";
import LoginPage from "./pages/Login/loginPage";
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

const useStyles = makeStyles({
    app: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        left: '0',
        top: '0',
        color: 'white',
        backgroundColor: '#393939',
    },
})

function App() {
    const classes = useStyles();
    return (
        <AuthContextProvider>
            <Router>
                <div className={classes.app}>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegistrationPage/>}/>
                        <Route path="/alerts" element={<ProtectedRoutes> <AlertsPage/></ProtectedRoutes>}/>
                        <Route path="/create_alert" element={<ProtectedRoutes> <CreateAlertPage/></ProtectedRoutes>}/>
                        <Route path="/maps" element={<ProtectedRoutes> <MapsPage/></ProtectedRoutes>}/>
                        <Route path="/profile" element={<ProtectedRoutes> <ProfilePage/></ProtectedRoutes>}/>
                        <Route path="/:id/alert_view" element={<ProtectedRoutes> <AlertViewPage/></ProtectedRoutes>}/>
                        <Route path="/:id/edit_alert" element={<ProtectedRoutes> <EditAlertPage/></ProtectedRoutes>}/>
                        <Route path="/:id/alert_view/:id/history_view"
                               element={<ProtectedRoutes> <AlertHistoryViewPage/></ProtectedRoutes>}/>
                    </Routes>
                </div>
            </Router>
        </AuthContextProvider>
    );
}

export default App;
