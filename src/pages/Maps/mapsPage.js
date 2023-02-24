import "./mapsPage.css"
import BottomNav from "../../components/bottomNav/bottomNav";
import {useState} from "react";

function MapsPage() {
    const [tab, setTab] = useState(0)

    return (
        <div>
            <p>Maps Page</p>
            <BottomNav value={tab} onChange={setTab}/>
        </div>
    );
}

export default MapsPage;