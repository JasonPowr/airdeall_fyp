import {ArrowBack, Check} from "@material-ui/icons";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {auth} from "../../../firebase";
import {getAlertHistoryById, getAlertVideo} from "../../../model/db/DB";
import VideoCard from "../../../components/Cards/VideoCard/VideoCard";
import {generateUserMap} from "../../../components/Maps/maps";
import {useLoadScript} from "@react-google-maps/api";
import SubmitAlertIncidentToMap from "../../../components/Forms/SubmitAlertIncidentToMapForm/SubmitAlertIncidentToMap";
import {Fab} from "@mui/material";

export default function AlertHistoryViewPage() {
    const location = useLocation();
    const alertId = location.state?.alertId;
    const alertHistoryId = location.state?.alertHistoryId;
    const navigate = useNavigate()
    const [alertHistory, setAlertHistory] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [video, setVideo] = useState(null);
    const [incidentReport, setIncidentReport] = useState("")

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

                    if (foundAlertHistory.incidentReport !== "") {
                        setIncidentReport(foundAlertHistory.incidentReport)
                    }
                })
            }
        })
    }, []);

    useEffect(() => {

        if (incidentReport !== "") {
            setIncidentReport(incidentReport)
        }
        setTimeout(() => {
            setIsSubmitted(false)
        }, 2000)
    }, [isSubmitted, incidentReport]);

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

                    {alertHistory.alert.includeOnPublicMap && (
                        <div>
                            {isSubmitted ? (
                                <Fab
                                    aria-label="save"
                                    color="primary"
                                >
                                    <Check/>
                                </Fab>
                            ) : (
                                <div>
                                    <SubmitAlertIncidentToMap alert={alertHistory.alert}
                                                              setIsSubmitted={setIsSubmitted}
                                                              alertHistoryId={alertHistoryId}
                                                              incidentReport={incidentReport}
                                                              setIncidentReport={setIncidentReport}/>
                                </div>
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