import {ArrowBack} from "@material-ui/icons";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {auth} from "../../../firebase";
import {getAlertHistoryById, getAlertVideo} from "../../../model/db/DB";
import VideoCard from "../../../components/Cards/VideoCard/VideoCard";

export default function AlertHistoryViewPage() {
    const location = useLocation();
    const alertId = location.state?.alertId;
    const alertHistoryId = location.state?.alertHistoryId;
    const navigate = useNavigate()
    const [alertHistory, setAlertHistory] = useState(null);
    const [video, setVideo] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                getAlertHistoryById(alertId, alertHistoryId).then(foundAlertHistory => {
                    setAlertHistory(foundAlertHistory)
                    if (foundAlertHistory.alert.automaticRecordings) {
                        getAlertVideo(alertHistoryId).then(foundVideo => {
                            setVideo(foundVideo)
                        })
                    }
                })
            }
        })
    }, []);

    function handleBack() {
        navigate(`/${alertId}/alert_view`, {state: {alertId: alertId}});
    }

    return (
        <div className={"createAlertPage"}>
            <header>
                <ArrowBack onClick={handleBack} fontSize={"large"}/>
            </header>
            {alertHistory != null ? (
                <div>
                    <p>Time & Date</p>

                    <p>Maps</p>
                    {alertHistory.alert.automaticRecordings && (
                        <div>
                            <p>Videos</p>
                            {video != null ? (
                                <VideoCard video={video}/>
                            ) : (
                                <p>No Video found.</p>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading ....</p>
            )}
        </div>
    );
}