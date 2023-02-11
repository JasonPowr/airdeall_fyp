import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./pages/Home/homePage";
import LoginPage from "./pages/Login/loginPage";
import RegistrationPage from "./pages/Register/registrationPage";
import "./App.css"
import {makeStyles} from "@material-ui/core";
import AlertsPage from "./pages/Alerts/alertpage/alertPage";
import {AuthContextProvider} from "./contexts/authContext";
import ProtectedRoutes from "./components/ProtectedRoute/ProtectedRoutes";
import CreateAlertPage from "./pages/Alerts/createAlertPage/createAlertPage";
import {requestCameraAccess} from "./Helpers/Camera/cameraBehaviour";

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
    requestCameraAccess()

    return (
        <AuthContextProvider>
        <Router>
            <div className={classes.app}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/alerts" element={<ProtectedRoutes> <AlertsPage /></ProtectedRoutes>} />
                    <Route path="/create_alert" element={<ProtectedRoutes> <CreateAlertPage /></ProtectedRoutes>} />
                </Routes>
            </div>
        </Router>
        </AuthContextProvider>
    );
}

export default App;
