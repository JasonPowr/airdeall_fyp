import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./pages/Home/homePage";
import LoginPage from "./pages/Login/loginPage";
import RegistrationPage from "./pages/Register/registrationPage";
import "./App.css"
import {makeStyles} from "@material-ui/core";

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
        <Router>
            <div className={classes.app}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
