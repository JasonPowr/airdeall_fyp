import "./profilePage.css"
import BottomNav from "../../components/bottomNav/bottomNav";
import React from "react";
import ProfileComponent from "../../components/Profile/ProfileComponent";

function ProfilePage() {

    return (
        <div>
            <ProfileComponent/>
            <BottomNav value={3}/>
        </div>
    );
}

export default ProfilePage;