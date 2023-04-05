import {ArrowBack} from "@material-ui/icons";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {auth} from "../../../firebase";
import {getAlertHistoryById, getAlertVideo} from "../../../model/db/DB";
import VideoCard from "../../../components/Cards/VideoCard/VideoCard";
import {generateUserMap} from "../../../components/Maps/maps";
import {useLoadScript} from "@react-google-maps/api";

export default function AlertHistoryViewPage() {
    const location = useLocation();
    const alertId = location.state?.alertId;
    const alertHistoryId = location.state?.alertHistoryId;
    const navigate = useNavigate()
    const [alertHistory, setAlertHistory] = useState(null);
    const [video, setVideo] = useState(null);

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    })

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                getAlertHistoryById(alertId, alertHistoryId).then(foundAlertHistory => {
                    setAlertHistory(foundAlertHistory)
                    if (foundAlertHistory.alert.automaticRecording) {
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

                    {alertHistory.alert.sms.sendSMS && (
                        <div>
                            <p>Maps</p>
                            {alertHistory.alert.sms.locationInfo || alertHistory.alert.sms.recurringLocationInfo ? (
                                (isLoaded ? (
                                    <div>
                                        {generateUserMap(alertHistory.alert.sms.recurringLocationInfo, alertHistory.locationInfo)}
                                    </div>
                                ) : (
                                    <div>
                                        <p>Loading.....</p>
                                    </div>
                                ))
                            ) : (
                                <div>
                                    <p>No Location Information</p>
                                </div>
                            )
                            }
                        </div>
                    )}

                    {alertHistory.alert.automaticRecording && (
                        <div>
                            <p>Videos</p>
                            {video != null ? (
                                <VideoCard video={video}/>
                            ) : (
                                <p>Loading....</p>
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