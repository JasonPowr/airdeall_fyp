import {ArrowBack, Check} from "@material-ui/icons";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {auth} from "../../../firebase";
import {getAlertHistoryById, getAlertVideo} from "../../../model/db/DB";
import VideoCard from "../../../components/Cards/VideoCard/VideoCard";
import SubmitAlertIncidentToMap from "../../../components/Forms/SubmitAlertIncidentToMapForm/SubmitAlertIncidentToMap";
import {Fab} from "@mui/material";
import {useLoadScript} from "@react-google-maps/api";

export default function AlertHistoryViewPage() {
    const location = useLocation();
    const alertId = location.state?.alertId;
    const alertHistoryId = location.state?.alertHistoryId;
    const navigate = useNavigate()
    const [alertHistory, setAlertHistory] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [video, setVideo] = useState(null);
    const [alertLocation, setAlertLocation] = useState(null);
    const [incidentReport, setIncidentReport] = useState("")

    const [showRecurring, setShowRecurring] = useState(false)
    const [recurringAlertLocations, setRecurringAlertLocations] = useState()
    const [encodedPath, setEncodedPath] = useState(null);

    useLoadScript({
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

                    if (foundAlertHistory.alert.includeOnPublicMap || foundAlertHistory.alert.sms.locationInfo) {
                        let alertLocationString = foundAlertHistory.locationInfo[0].lat.toString() + "," + foundAlertHistory.locationInfo[0].lng.toString()
                        setAlertLocation(alertLocationString)
                    }

                    if (foundAlertHistory.alert.sms.recurringLocationInfo) {
                        let locations = []
                        foundAlertHistory.locationInfo.map((ping) => {
                            locations.push(ping.lat.toString() + "," + ping.lng.toString())
                        })
                        setShowRecurring(true)
                        setRecurringAlertLocations(locations)
                        calcRoute(locations[0], locations[locations.length - 1], locations)
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

    function calcRoute(start, end, locations) {
        const waypts = [];

        locations.map((l) => {
            waypts.push({
                location: l,
                stopover: true,
            });
        })

        const directionsService = new window.google.maps.DirectionsService();
        const request = {
            origin: start,
            destination: end,
            waypoints: waypts,
            travelMode: 'DRIVING'
        };

        directionsService.route(request, function (result, status) {
            if (status === 'OK') {
                console.log(result)
                setEncodedPath(result.routes[0].overview_polyline)
            }
        });
    }

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
                    <h3>Time & Date</h3>

                    <p>Start Time :{alertHistory.timeStart}</p>
                    <p>End Time :{alertHistory.timeEnd}</p>

                    <div>
                        <h3>Recordings</h3>
                        {alertHistory.alert.automaticRecording ? (
                            <div>
                                <p>Videos</p>
                                {video != null ? (
                                    <VideoCard video={video}/>
                                ) : (
                                    <p>Loading....</p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <p>Video Recording Not Enabled</p>
                            </div>

                        )}
                    </div>

                    <div>
                        <h3>Location Information</h3>
                        {(alertHistory.alert.includeOnPublicMap || alertHistory.alert.sms.locationInfo || alertHistory.alert.sms.recurringLocationInfo) ? (
                            <div>
                                <div>
                                    {(alertHistory.alert.sms.recurringLocationInfo && showRecurring && encodedPath && recurringAlertLocations) && (
                                        <img
                                            src={`https://maps.googleapis.com/maps/api/staticmap?size=400x400&markers=color:red|${recurringAlertLocations[0]}&markers=color:red|${recurringAlertLocations[recurringAlertLocations.length - 1]}&center=${alertLocation}&zoom=12&path=weight:12%7Ccolor:red%7Cenc:${encodedPath}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                                            alt={"alertLocation"}
                                        />
                                    )}
                                </div>

                                <div>
                                    {((alertHistory.alert.includeOnPublicMap || alertHistory.alert.sms.locationInfo) && !showRecurring) && (
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

                                                    {alertLocation && (
                                                        <img
                                                            src={`https://maps.googleapis.com/maps/api/staticmap?center=${alertLocation}&zoom=13&size=400x400&markers=color:red|${alertLocation}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                                                            alt={"alertLocation"}
                                                        />
                                                    )}

                                                    <SubmitAlertIncidentToMap alert={alertHistory.alert}
                                                                              setIsSubmitted={setIsSubmitted}
                                                                              alertHistory={alertHistory}
                                                                              incidentReport={incidentReport}
                                                                              setIncidentReport={setIncidentReport}/>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>
                                Location Information Not Enabled
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading ....</p>
            )}
        </div>
    );
}

//https://developers.google.com/maps/documentation/maps-static/start
//https://developers.google.com/maps/documentation/maps-static/start#Latlons
//https://stackoverflow.com/questions/32477351/how-can-i-generate-walking-or-driving-static-google-map