import CreateAlertForm from "../../../components/Forms/createForm/createAlertForm";
import {makeStyles} from "@material-ui/core";
import BottomNav from "../../../components/bottomNav/bottomNav";
import React from "react";

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

export default function CreateAlertPage() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <h2>Alert Customization</h2>
            <CreateAlertForm/>
            <BottomNav value={0}/>
        </div>
    );
}


//https://www.w3schools.com/react/react_css.asp