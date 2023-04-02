import "./profilePage.css"
import BottomNav from "../../components/bottomNav/bottomNav";
import {useState} from "react";
import ProfileComponent from "../../components/Profile/ProfileComponent";

function ProfilePage() {
    const [tab, setTab] = useState(0)

    return (
        <div>
            <ProfileComponent/>
            <BottomNav value={tab} onChange={setTab}/>
        </div>
    );
}

export default ProfilePage;