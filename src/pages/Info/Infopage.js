import BottomNav from "../../components/bottomNav/bottomNav";
import React, {useState} from "react";
import InfoPageContent from "../../components/Info/infoPageContent";

function InfoPage() {
    const [tab, setTab] = useState(0);
    return (
        <div>
            <div>Info</div>
            <InfoPageContent/>
            <BottomNav value={tab} onChange={setTab}/>
        </div>
    );
}


export default InfoPage;
