import BottomNav from "../../components/bottomNav/bottomNav";
import React from "react";
import {useLoadScript} from "@react-google-maps/api"
import Map from "../../components/Maps/maps"

import {libraries} from "../../components/Maps/config";
import Loading from "../../components/Loading/Loading";


function MapsPage() {

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    })

    if (!isLoaded) return <div><Loading/><BottomNav value={1}/></div>
    return (
        <div>
            <div><Map/></div>
            <BottomNav value={1}/>
        </div>
    );
}


export default MapsPage;
