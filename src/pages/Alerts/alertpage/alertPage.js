import {UserAuth} from "../../../contexts/Auth/authContext";
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import {auth} from "../../../firebase";
import "./alertPage.css"
import BottomNav from "../../../components/bottomNav/bottomNav";
import {requestCameraAccess} from "../../../components/Camera/camera";
import {requestLocationPermission} from "../../../components/Maps/maps";
import {getUserAlertsFromDB} from "../../../model/db/DB";
import AlertCard from "../../../components/Cards/AlertCard";

function AlertsPage() {
    const {user, logOut} = UserAuth()
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const [alerts, setAlerts] = useState([]);
    const [tab, setTab] = useState(0)

    requestCameraAccess()
    requestLocationPermission()

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                getUserAlertsFromDB().then(alerts => {
                    setAlerts(alerts)
                })
            } else {
                // User is signed out.
            }
        })
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        try {
            logOut()
            navigate('/')
        } catch (e) {
            setError(e.message)
        }
    }

    if (alerts.length === 0) return <div>
        <div>No alerts found</div>
        <Link to={"/create_alert"}><Button>Create Alert</Button></Link>
        <Button onClick={handleSubmit}>Sign Out</Button>
        <div><BottomNav/></div>
    </div>
    return (
        <div className={"createAlertPage"}>
            <p></p>

            <div className={"alertContainer"}>
                {alerts.map((index) =>
                    <AlertCard key={index.alert.id} alert={index.alert}/>)}
            </div>

            <Link to={"/create_alert"}><Button>Create Alert</Button></Link>
            <Button onClick={handleSubmit}>Sign Out</Button>
            <BottomNav value={tab} onChange={setTab}/>
        </div>
    );
}

export default AlertsPage;