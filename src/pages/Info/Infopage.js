import BottomNav from "../../components/bottomNav/bottomNav";
import React from "react";
import InfoPageContent from "../../components/Info/infoPageContent";

function InfoPage() {
    return (
        <div>
            <div>Info</div>
            <InfoPageContent/>
            <BottomNav value={2}/>
        </div>
    );
}


export default InfoPage;
