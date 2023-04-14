import React from 'react'
import {BottomNavigation, BottomNavigationAction} from "@material-ui/core";
import {Home, Info, Map, PeopleRounded} from "@material-ui/icons";
import "./bottomNav.css"
import {Link} from "react-router-dom";

export default function BottomNav({value, onChange}) {
    return (
        <BottomNavigation showLabels={true} className={"bottom-nav"} value={value} onChange={(e, tab) => onChange(tab)}>

            <BottomNavigationAction style={{color: "white"}} label={"Alerts"}
                                    icon={<Home style={{color: 'white'}}/>} component={Link} to="/alerts"/>

            <BottomNavigationAction style={{color: "white"}} label={"Maps"}
                                    icon={<Map style={{color: 'white'}}/>} component={Link} to="/maps"/>

            <BottomNavigationAction style={{color: "white"}} label={"Info Section"}
                                    icon={<Info style={{color: 'white'}}/>} component={Link} to="/info"/>

            <BottomNavigationAction style={{color: "white"}} label={"Profile"}
                                    icon={<PeopleRounded style={{color: 'white'}}/>} component={Link} to="/profile"/>

        </BottomNavigation>
    )
}