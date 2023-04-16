import React from 'react'
import {BottomNavigation, BottomNavigationAction, makeStyles} from "@material-ui/core";
import {Home, Info, Map, PeopleRounded} from "@material-ui/icons";
import "./bottomNav.css"

import {Link as RouterLink} from 'react-router-dom';

const useStyles = makeStyles({
    bottom_nav: {
        position: 'fixed',
        margin: 'auto',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: "white",
        opacity: "80%",
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
    },
    icons: {
        color: "#4d41b4",
    },
})

export default function BottomNav({value}) {
    const classes = useStyles();

    return (
        <BottomNavigation showLabels value={value} className={classes.bottom_nav}>
            <BottomNavigationAction component={RouterLink} label="Home" icon={<Home/>} to="/alerts"/>
            <BottomNavigationAction component={RouterLink} label="Maps" icon={<Map/>} to="/maps"/>
            <BottomNavigationAction component={RouterLink} label="Info" icon={<Info/>} to="/info"/>
            <BottomNavigationAction component={RouterLink} label="Profile" icon={<PeopleRounded/>} to="/profile"/>
        </BottomNavigation>
    );
}

//https://mui.com/material-ui/react-bottom-navigation/
//https://mui.com/material-ui/guides/routing/