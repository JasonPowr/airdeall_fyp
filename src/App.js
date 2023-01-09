import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegistrationPage from "./pages/registrationPage";
import "./css/App.css"
import {CssBaseline, Grid} from "@material-ui/core"
function App() {
    return (
        <Router>
            <div>
                <Grid container direction={"column"}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegistrationPage />} />
                    </Routes>
                </Grid>
            </div>
            <CssBaseline />
        </Router>
    );
}

export default App;
