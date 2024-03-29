import CreateAlertForm from "../../../components/Forms/createForm/createAlertForm";
import BottomNav from "../../../components/bottomNav/bottomNav";
import {useLocation} from "react-router-dom";
import {auth} from "../../../firebase";
import {getAlertById} from "../../../model/db/DB";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core";
import Loading from "../../../components/Loading/Loading";

const useStyles = makeStyles({
    container: {
        paddingTop: '25px',
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",
        height: '87.75%',
        overflow: 'auto',
    },
})

export default function EditAlertPage() {
    const location = useLocation();
    const alertId = location.state?.alertId;
    const [alert, setAlert] = useState(null);
    const classes = useStyles();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                getAlertById(alertId).then(foundAlert => {
                    setAlert(foundAlert)
                })
            }
        })
    }, []);

    if (alert === null) {
        return (
            <div>
                <Loading/>
                <BottomNav></BottomNav>
            </div>
        )
    } else {
        return (
            <div className={classes.container}>
                <h2>Alert Customization</h2>
                <CreateAlertForm editAlert={alert}></CreateAlertForm>
                <BottomNav value={0}/>
            </div>
        )
    }
}