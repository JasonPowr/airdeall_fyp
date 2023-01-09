import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegistrationPage from "./pages/registrationPage";

function App() {
  return (
      <Router>
          <div>
              <div>
                  <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegistrationPage />} />
                  </Routes>
              </div>
          </div>
      </Router>
  );
}

export default App;
