import React, {useState} from "react";
import "./alertPage.css"
import {requestCameraAccess} from "../../../components/Camera/camera";
import {requestLocationPermission} from "../../../components/Maps/maps";
import {Link} from "react-router-dom";
import {Button} from "@material-ui/core";
import BottomNav from "../../../components/bottomNav/bottomNav";
import Alerts from "../../../components/Alerts/Alerts";

function AlertsPage() {
    const [tab, setTab] = useState(0)

    requestCameraAccess()
    requestLocationPermission()

    return (
        <div>
            <h1> Your Alerts </h1>
            <Alerts/>
            <Link to={"/create_alert"}><Button>Create Alert</Button></Link>
            <BottomNav value={tab} onChange={setTab}/>
        </div>
    );
}

export default AlertsPage;