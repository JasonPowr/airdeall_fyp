import React from 'react'
import {BottomNavigation, BottomNavigationAction} from "@material-ui/core";
import {Home, Map, PeopleRounded} from "@material-ui/icons";
import {Link} from "react-router-dom";
import "./bottomNav.css"

export default function BottomNav({value, onChange}) {
    return (
        <BottomNavigation className={"bottom-nav"} value={value} onChange={(e, tab) => onChange(tab)}>
            <Link to={"/alerts"}><BottomNavigationAction icon={<Home style={{color: 'white'}}/>}/></Link>
            <Link to={"/maps"}><BottomNavigationAction icon={<Map style={{color: 'white'}}/>}/></Link>
            <Link to={"/profile"}> <BottomNavigationAction icon={<PeopleRounded style={{color: 'white'}}/>}/> </Link>
        </BottomNavigation>
    )
}