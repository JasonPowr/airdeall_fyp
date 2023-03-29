import CreateAlertForm from "../../../components/Forms/createForm/createAlertForm";
import BottomNav from "../../../components/bottomNav/bottomNav";
import {ArrowBack} from "@material-ui/icons";
import {useLocation, useNavigate} from "react-router-dom";
import {auth} from "../../../firebase";
import {getAlertById} from "../../../model/db/DB";
import {useEffect, useState} from "react";


export default function EditAlertPage() {
    const location = useLocation();
    const alertId = location.state?.alertId;
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                getAlertById(alertId).then(foundAlert => {
                    setAlert(foundAlert)
                })
            }
        })
    }, []);

    function handleBack() {
        navigate(`/${alert.id}/alert_view`, {state: {alertId: alert.id}});
    }

    if (alert === null) {
        return (
            <div>
                <div>Loading...</div>
                <BottomNav></BottomNav>
            </div>
        )
    } else {
        return (
            <div>
                <header>
                    <ArrowBack onClick={handleBack} fontSize={"large"}/>
                    <p>Edit Alert</p>
                </header>
                <CreateAlertForm editAlert={alert}></CreateAlertForm>
            </div>
        )
    }
}