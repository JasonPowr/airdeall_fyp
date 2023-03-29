import "./alertViewPage.css"
import BottomNav from "../../../components/bottomNav/bottomNav";
import {useLocation, useNavigate} from "react-router-dom";
import {deleteAlert, getAlertById} from "../../../model/db/DB";
import React, {useEffect, useState} from "react";
import {auth} from "../../../firebase";
import {ArrowBack, Delete, Edit} from "@material-ui/icons";
import AlertHistoryCard from "../../../components/Cards/AlertHistoryCard/AlertHistoryCard";

function AlertViewPage() {
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

    function handleDelete() {
        deleteAlert(alertId).then()
        navigate(`/alerts`)
    }

    function handleEdit() {
        navigate(`/${alert.id}/edit_alert`, {state: {alertId: alert.id}});
    }

    function handleBack() {
        navigate("/alerts");
    }

    if (alert == null) return <div>
        <div>Loading...</div>
        <div><BottomNav/></div>
    </div>

    return (
        <div>
            <header>
                <ArrowBack onClick={handleBack} fontSize={"large"}/>
            </header>
            <div className={"alertInfo"}>
                <p>{alert.title}</p>
                <p>{alert.desc}</p>
            </div>

            <div className={"crud"}>
                <Delete onClick={handleDelete} fontSize={"inherit"}></Delete>
                <Edit onClick={handleEdit} fontSize={"inherit"}></Edit>
            </div>

            <div className={"alertHistory"}>
                <p>Alert History</p>
                <AlertHistoryCard/>
            </div>
            <div><BottomNav/></div>
        </div>

    );
}

export default AlertViewPage;