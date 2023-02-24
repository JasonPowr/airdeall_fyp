import "./profilePage.css"
import BottomNav from "../../components/bottomNav/bottomNav";
import {useState} from "react";

function ProfilePage() {
    const [tab, setTab] = useState(0)

    return (
        <div>
            <p>Profile Page</p>
            <BottomNav value={tab} onChange={setTab}/>
        </div>
    );
}

export default ProfilePage;