import "./mapsPage.css"
import BottomNav from "../../components/bottomNav/bottomNav";
import React, {useState} from "react";
import {useLoadScript} from "@react-google-maps/api"
import Map from "../../components/Maps/maps"

import {libraries} from "../../components/Maps/config";

function MapsPage() {
    const [tab, setTab] = useState(0);

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    })

    if (!isLoaded) return <div>
        <div>Loading...</div>
        <BottomNav value={tab} onChange={setTab}/></div>
    return (
        <div>
            <div><Map/></div>
            <BottomNav value={tab} onChange={setTab}/>
        </div>
    );
}


export default MapsPage;
