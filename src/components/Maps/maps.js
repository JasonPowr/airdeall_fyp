import React, {useEffect, useRef, useState} from "react"
import "./map.css"
import {Circle, DirectionsRenderer, GoogleMap, HeatmapLayer, InfoWindow, Marker} from "@react-google-maps/api";
import {getActiveAlerts, getAllPublicIncidents, getAllSafePoints, updateLocationInDb} from "../../model/db/DB";
import {auth} from "../../firebase";
import * as geolib from "geolib";
import {Cancel, Directions} from "@material-ui/icons";

export function requestLocationPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            auth.onAuthStateChanged(async user => {
                if (user) {
                    await updateLocationInDb(position.coords.latitude,
                        position.coords.longitude)
                }
            })
        }, () => {
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

export function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            async position => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                resolve(location);
                await updateLocationInDb(position.coords.latitude, position.coords.longitude)
            },
            error => {
                reject(error);
            }
        );
    });
}

//https://www.freecodecamp.org/news/javascript-promise-tutorial-how-to-resolve-or-reject-promises-in-js/

export async function getClosestSafePoints() {
    let safePointsInVicinity = []
    let safePoints = await getAllSafePoints()
    let userLocation = await getLocation()

    safePoints.map((safePoint) => {
        const safePointLocation = {lat: safePoint.location._lat, lng: safePoint.location._long}
        const distance = geolib.getDistance(userLocation, safePointLocation);
        if (distance <= 2000) {
            safePointsInVicinity.push(safePoint)
        }
    })

    return safePointsInVicinity
}


export default function Map() {
    const mapRef = useRef();
    const [activeAlerts, setActiveAlerts] = useState(null);
    const [activeAlertsInProximity, setActiveAlertsInProximity] = useState([]);
    const [publicIncidents, setPublicIncidents] = useState(null);
    const [infoWindow, showInfoWindow] = useState(false)
    const [infoWindowContent, setInfoWindowContent] = useState([])
    const [userLocation, setUserLocation] = useState(null);
    const [places, setPlaces] = useState(null);
    const [safePoints, setSafePoints] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false)
    const [isInProximity, setIsInProximity] = useState(false)
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [heatMapData, setHeatMapData] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });

        getActiveAlerts().then((alert) => {
            setActiveAlerts(alert);
        });

        getAllPublicIncidents().then((publicIncidents) => {
            setPublicIncidents(publicIncidents);
        });

        getAllSafePoints().then((safePoints) => {
            setSafePoints(safePoints)
        })

    }, []);


    const mapOptions = {
        disableDefaultUI: true,
    };

    const circleOptions = {
        visible: true,
        clickable: false,
        editable: false,
        draggable: false,

        strokeWeight: 2,
        strokeOpacity: 0.5
    }

    const checkActiveAlertsInProximity = () => {
        activeAlerts.forEach((alert) => {
            const distance = geolib.getDistance(userLocation, alert);
            if (distance <= 2000) {
                setIsInProximity(true)
                setActiveAlertsInProximity(alert)
            }
        });
    }

    let foundPlaces = []
    const loadPlaces = (type) => {
        const request = {
            location: userLocation,
            radius: 5000,
            type: [type]
        };

        let service = new window.google.maps.places.PlacesService(mapRef.current);
        service.nearbySearch(request, callback);

        function callback(results, status) {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {

                    if (type === "police") {
                        results[i].types.push("POLICE_STATION_MARKER")
                    } else if (type === "gym") {
                        results[i].types.push("GYM_MARKER")
                    } else if (type === "hospital") {
                        results[i].types.push("HOSPITAL_MARKER")
                    }
                    foundPlaces.push(results[i])
                    setPlaces(foundPlaces)
                }
            }
            //https://developers.google.com/maps/documentation/javascript/places#place_search_requests
            //https://developers.google.com/maps/documentation/places/web-service/supported_types
        }
    }

    async function handleDirections(userLocation, lat, lng) {
        const directionsService = new window.google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: {
                lat: userLocation.lat,
                lng: userLocation.lng
            },
            destination: {
                lat: lat,
                lng: lng,
            },
            travelMode: window.google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
    }

    function generateHeatMapData() {
        let data = []
        publicIncidents.map((incident) => {
            data.push(new window.google.maps.LatLng(incident.location._lat, incident.location._long));
        })
        setHeatMapData(data)
    }

    return (
        <div className={"container"}>
            <div className={"map"}>
                {(userLocation && activeAlerts && publicIncidents) && (
                    <GoogleMap
                        zoom={13}
                        options={mapOptions}
                        center={userLocation}
                        mapContainerClassName={"map-container"}
                        onLoad={async (map) => {
                            mapRef.current = map;
                            checkActiveAlertsInProximity()
                            generateHeatMapData()
                            await loadPlaces('police')
                            await loadPlaces('gym')
                            await loadPlaces('hospital')
                            setIsLoaded(true)
                        }}>


                        {userLocation &&
                            <Marker
                                icon={{
                                    url: (require('../../assets/images/mapImages/userLocation.png')),
                                    scaledSize: new window.google.maps.Size(50, 50)
                                }}
                                position={userLocation}
                                onClick={() => {
                                    mapRef.current.panTo({
                                        lat: userLocation.lat,
                                        lng: userLocation.lng
                                    })
                                    setInfoWindowContent(userLocation)
                                    showInfoWindow(true)
                                }}
                            >

                                {(infoWindow && (infoWindowContent === userLocation)) && (
                                    <InfoWindow
                                        options={{
                                            position: {
                                                lat: infoWindowContent.lat,
                                                lng: infoWindowContent.lng
                                            },
                                        }}
                                        onCloseClick={() => {
                                            showInfoWindow(false)
                                        }}
                                    >
                                        <div className={"map-infoWindow"}>
                                            <h3>Your Location!</h3>
                                        </div>

                                    </InfoWindow>
                                )}
                                <Circle center={userLocation} radius={2000} options={circleOptions}/>
                            </Marker>
                        }


                        {(activeAlertsInProximity && isInProximity) && (
                            <div>
                                {activeAlerts.map((alert, index) =>
                                    <Marker
                                        icon={{
                                            url: (require('../../assets/images/mapImages/activeAlertIcon.png')),
                                            scaledSize: new window.google.maps.Size(30, 30)
                                        }}
                                        key={index}
                                        position={alert}
                                        onClick={() => {
                                            mapRef.current.panTo({
                                                lat: alert.lat,
                                                lng: alert.lng
                                            })
                                            setInfoWindowContent(alert)
                                            showInfoWindow(true)
                                        }}
                                    >
                                        {(infoWindow && (infoWindowContent === alert)) && (
                                            <InfoWindow
                                                options={{
                                                    position: {
                                                        lat: infoWindowContent.lat,
                                                        lng: infoWindowContent.lng
                                                    },
                                                }}
                                                onCloseClick={() => {
                                                    showInfoWindow(false)
                                                }}
                                            >
                                                <div className={"map-infoWindow"}>
                                                    <h3>There is currently an alert active here!</h3>

                                                    <div>
                                                        <div className={"directions-div"} onClick={() => {
                                                            handleDirections(userLocation, alert.lat, alert.lng).then(r => {
                                                            })
                                                        }}>
                                                            <Directions fontSize={"medium"}/>
                                                            <p>Get Directions</p>
                                                        </div>

                                                        <div className={"directions-div"} onClick={() => {
                                                            setDirectionsResponse(null)
                                                            showInfoWindow(false)
                                                        }}>
                                                            <Cancel fontSize={"medium"}/>
                                                            <p>Cancel</p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </InfoWindow>
                                        )}

                                    </Marker>
                                )}
                            </div>

                        )}

                        {publicIncidents && (
                            <div>
                                {publicIncidents.map((incident, index) =>
                                    <Marker icon={{
                                        url: (require('../../assets/images/mapImages/publicAlertIcon.png')),
                                        scaledSize: new window.google.maps.Size(30, 30)
                                    }}
                                            key={index}
                                            position={{lat: incident.location._lat, lng: incident.location._long}}
                                            onClick={() => {
                                                mapRef.current.panTo({
                                                    lat: incident.location._lat,
                                                    lng: incident.location._long
                                                })
                                                setInfoWindowContent(incident)
                                                showInfoWindow(true)
                                            }}
                                    >

                                        {(infoWindow && (infoWindowContent === incident)) && (
                                            <InfoWindow
                                                options={{
                                                    position: {
                                                        lat: infoWindowContent.location._lat,
                                                        lng: infoWindowContent.location._long
                                                    },
                                                }}
                                                onCloseClick={() => {
                                                    showInfoWindow(false)
                                                }}
                                            >
                                                <div className={"map-infoWindow"}>
                                                    <h3>An incident Has Occurred In this area!</h3>
                                                    <h4>Here is a brief report of the Incident</h4>
                                                    <p className={"p-tag"}>Time: {infoWindowContent.timeStart + " - " + infoWindowContent.timeEnd}</p>
                                                    <p className={"p-tag"}>Date: {infoWindowContent.date}</p>

                                                    <h5>User Account:</h5>
                                                    <p className={"p-tag"}>{infoWindowContent.incidentReport}</p>

                                                    <div>
                                                        <div className={"directions-div"} onClick={() => {
                                                            handleDirections(userLocation, incident.location._lat, incident.location._long).then(r => {
                                                            })
                                                        }}>
                                                            <Directions fontSize={"medium"}/>
                                                            <p>Get Directions</p>
                                                        </div>

                                                        <div className={"directions-div"} onClick={() => {
                                                            setDirectionsResponse(null)
                                                            showInfoWindow(false)
                                                        }}>
                                                            <Cancel fontSize={"medium"}/>
                                                            <p>Cancel</p>
                                                        </div>
                                                    </div>

                                                </div>

                                            </InfoWindow>
                                        )}
                                    </Marker>
                                )}
                            </div>
                        )}

                        {(places && isLoaded) && (
                            <div>
                                {places.map((place, index) => {
                                        let url = "";

                                        if (place.types.includes("POLICE_STATION_MARKER")) {
                                            url = (require('../../assets/images/mapImages/policeStation.png'))
                                        } else if (place.types.includes("GYM_MARKER")) {
                                            url = (require('../../assets/images/mapImages/gym.png'))
                                        } else if (place.types.includes("HOSPITAL_MARKER")) {
                                            url = (require('../../assets/images/mapImages/hospitalIcon.png'))
                                        }

                                        return (
                                            <div key={index}>
                                                <Marker
                                                    icon={{
                                                        url: url,
                                                        scaledSize: new window.google.maps.Size(30, 30),
                                                    }}
                                                    position={{
                                                        lat: place.geometry.location.lat(),
                                                        lng: place.geometry.location.lng(),
                                                    }}
                                                    onClick={() => {
                                                        mapRef.current.panTo({
                                                            lat: place.geometry.location.lat(),
                                                            lng: place.geometry.location.lng(),
                                                        })
                                                        setInfoWindowContent(place)
                                                        showInfoWindow(true)
                                                    }}>

                                                    {(infoWindow && (infoWindowContent === place)) && (
                                                        <InfoWindow
                                                            options={{
                                                                position: {
                                                                    lat: place.geometry.location.lat(),
                                                                    lng: place.geometry.location.lng(),
                                                                },
                                                            }}
                                                            onCloseClick={() => {
                                                                showInfoWindow(false)
                                                            }}
                                                        >
                                                            <div className={"map-infoWindow"}>
                                                                <h3>{place.name}</h3>
                                                                <div>
                                                                    <div className={"directions-div"} onClick={() => {
                                                                        handleDirections(userLocation, place.geometry.location.lat(), place.geometry.location.lng()).then(r => {
                                                                        })
                                                                    }}>
                                                                        <Directions fontSize={"medium"}/>
                                                                        <p>Get Directions</p>
                                                                    </div>

                                                                    <div className={"directions-div"} onClick={() => {
                                                                        setDirectionsResponse(null)
                                                                        showInfoWindow(false)
                                                                    }}>
                                                                        <Cancel fontSize={"medium"}/>
                                                                        <p>Cancel</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </InfoWindow>
                                                    )}

                                                </Marker>

                                            </div>
                                        )
                                    }
                                )}
                            </div>
                        )}

                        {safePoints && (
                            <div>
                                {safePoints.map((safePoint, index) =>
                                    <Marker
                                        icon={{
                                            url: (require('../../assets/images/mapImages/safePoint.png')),
                                            scaledSize: new window.google.maps.Size(30, 30),
                                        }}
                                        key={index}
                                        position={{lat: safePoint.location._lat, lng: safePoint.location._long}}
                                        onClick={() => {
                                            mapRef.current.panTo({
                                                lat: safePoint.location._lat,
                                                lng: safePoint.location._long
                                            })
                                            setInfoWindowContent(safePoint)
                                            showInfoWindow(true)
                                        }}
                                    >

                                        {(infoWindow && (infoWindowContent === safePoint)) && (
                                            <InfoWindow
                                                options={{
                                                    position: {
                                                        lat: infoWindowContent.location._lat,
                                                        lng: infoWindowContent.location._long
                                                    },
                                                }}
                                                onCloseClick={() => {
                                                    showInfoWindow(false)
                                                }}
                                            >

                                                <div className={"map-infoWindow"}>
                                                    <h3>{safePoint.name}</h3>
                                                    <div>
                                                        <div className={"directions-div"} onClick={() => {
                                                            handleDirections(userLocation, safePoint.location._lat, safePoint.location._long).then(r => {
                                                            })
                                                        }}>
                                                            <Directions fontSize={"medium"}/>
                                                            <p>Get Directions</p>
                                                        </div>

                                                        <div className={"directions-div"} onClick={() => {
                                                            setDirectionsResponse(null)
                                                            showInfoWindow(false)
                                                        }}>
                                                            <Cancel fontSize={"medium"}/>
                                                            <p>Cancel</p>
                                                        </div>
                                                    </div>
                                                </div>


                                            </InfoWindow>
                                        )}
                                    </Marker>
                                )}
                            </div>
                        )}

                        {directionsResponse && (
                            <DirectionsRenderer options={{
                                suppressMarkers: true,
                            }} directions={directionsResponse}/>
                        )}

                        {heatMapData && (
                            <HeatmapLayer data={heatMapData}/>
                        )}

                    </GoogleMap>
                )}
            </div>
        </div>
    )
}
//https://stackoverflow.com/questions/58529797/typeerror-b-lat-is-not-a-function-heatmap-layer
//https://developers.google.com/maps/documentation/javascript/heatmaplayer
//https://www.youtube.com/watch?v=2po9_CIRW7I&t=2577s
//https://stackoverflow.com/questions/71423686/how-to-add-custom-ico-or-svg-as-marker-icon-in-react-google-maps-api
//https://udarax.me/technology/how-to-draw-directions-between-2-points-in-the-google-maps-using-react-js/
//https://developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRequest
//https://linuxhint.com/remove-first-and-last-element-in-array-javascript/#:~:text=For%20removing%20the%20first%20and,which%20needs%20to%20be%20removed.
//https://stackoverflow.com/questions/12 507925/how-to-remove-only-a-and-b-markers-in-a-route-but-not-waypoint-marker