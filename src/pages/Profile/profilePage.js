import BottomNav from "../../components/bottomNav/bottomNav";
import React from "react";
import ProfileComponent from "../../components/Profile/ProfileComponent";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",
        overflow: "auto",
        height: "90%",
    },
})

function ProfilePage() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <ProfileComponent/>
            <BottomNav value={3}/>
        </div>
    );
}

export default ProfilePage;