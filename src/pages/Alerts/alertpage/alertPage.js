import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import {auth} from "../../../firebase";
import "./alertPage.css"
import BottomNav from "../../../components/bottomNav/bottomNav";
import {requestCameraAccess} from "../../../components/Camera/camera";
import {requestLocationPermission} from "../../../components/Maps/maps";
import {getUserAlertsFromDB} from "../../../model/db/DB";
import AlertCard from "../../../components/Cards/AlertCard/AlertCard";

function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [tab, setTab] = useState(0)
    //const [isLoading, setIsloading] = useState(true);

    requestCameraAccess()
    requestLocationPermission()

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {

                getUserAlertsFromDB().then(alerts => {
                    setAlerts(alerts)
                    //setIsloading(false)
                })
            }
        })
    }, []);

    if (alerts.length === 0) {
        return (
            <div>
                <Link to={"/create_alert"}><Button>Create Alert</Button></Link>
                <div>No alerts found</div>
                <div><BottomNav/></div>
            </div>
        )
        // } else if (isLoading) {
        //     return (
        //         <div>
        //             <Link to={"/create_alert"}><Button>Create Alert</Button></Link>
        //             <div>Loading...</div>
        //             <div><BottomNav/></div>
        //         </div>
        //     )
    } else {
        return (
            <div className={"createAlertPage"}>

                <Link to={"/create_alert"}><Button>Create Alert</Button></Link>

                <div className={"alertContainer"}>
                    {alerts.map((index) =>
                        <AlertCard key={index.alert.id} alert={index.alert}/>)}
                </div>

                <BottomNav value={tab} onChange={setTab}/>

            </div>
        );
    }
}

export default AlertsPage;