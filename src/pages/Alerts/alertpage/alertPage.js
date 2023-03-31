import {Link} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import "./alertPage.css"
import BottomNav from "../../../components/bottomNav/bottomNav";
import {requestCameraAccess} from "../../../components/Camera/camera";
import {requestLocationPermission} from "../../../components/Maps/maps";
import {getUserAlertsFromDB} from "../../../model/db/DB";
import AlertCard from "../../../components/Cards/AlertCard/AlertCard";
import UserContext from "../../../contexts/Auth/authContext";

function AlertsPage() {
    const {user} = useContext(UserContext)
    const [alerts, setAlerts] = useState([]);
    const [tab, setTab] = useState(0)

    requestCameraAccess()
    requestLocationPermission()

    useEffect(() => {
        if (user) {
            getUserAlertsFromDB().then(alerts => {
                setAlerts(alerts)
            })
        }
    }, []);

    if (alerts.length === 0) {
        return (
            <div>
                <Link to={"/create_alert"}><Button>Create Alert</Button></Link>
                <div>No alerts found</div>
                <div><BottomNav/></div>
            </div>
        )
    } else {
        return (
            <div className={"createAlertPage"}>
                <header>Your Alerts</header>
                <div className={"alertContainer"}>
                    {alerts.map((index) =>
                        <AlertCard key={index.alert.id} alert={index.alert}/>)}
                </div>
                <Link to={"/create_alert"}><Button>Create Alert</Button></Link>
                <BottomNav value={tab} onChange={setTab}/>
            </div>
        );
    }
}

export default AlertsPage;