import "./mapsPage.css"
import BottomNav from "../../components/bottomNav/bottomNav";
import React, {useState} from "react";
import MapContainer from "../../Helpers/Maps/maps";

function MapsPage() {
    const [tab, setTab] = useState(0);
    return (
        <div>
            <div>
                <MapContainer/>
            </div>
            <BottomNav value={tab} onChange={setTab}/>
        </div>
    );
}


export default MapsPage;

///https://www.npmjs.com/package/google-map-react