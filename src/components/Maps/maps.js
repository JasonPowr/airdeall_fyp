import React, {useEffect, useRef, useState} from "react"
import "./map.css"
import {Circle, DirectionsRenderer, GoogleMap, InfoWindow, Marker} from "@react-google-maps/api";
import {getActiveAlerts, getAllPublicIncidents, updateLocationInDb} from "../../model/db/DB";
import {auth} from "../../firebase";

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
                    lat: position.coords.latitude,  //change this
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

export function generateUserMap(isRecurring, alertLocations) {
    if (isRecurring) {
        return (
            <div>
                <div><HistoryMap locations={alertLocations}/></div>
            </div>
        )
    } else {
        return (
            <div>
                <div><HistoryMap locations={alertLocations}/></div>
            </div>
        )
    }
}

function HistoryMap({locations}) {
    const [alertLocations, setAlertLocations] = useState([]);
    const [directionsResponse, setDirectionsResponse] = useState(null);

    const getRoute = async (origin, destinations) => {
        const directionsService = new window.google.maps.DirectionsService();
        const wayPoints = destinations.slice(1, -1);
        const results = await directionsService.route({
            origin: origin,
            destination: destinations.at(destinations.length - 1),
            waypoints: wayPoints.map((waypoint) => ({
                location: waypoint,
                stopover: false
            })),
            travelMode: window.google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
    }

    useEffect(() => {
        setAlertLocations(locations);

        const destinations = []
        locations.map((l) => {
            destinations.push(l)
        })
        getRoute(locations[0], destinations);
    }, []);

    const mapOptions = {
        disableDefaultUI: true,
        center: {
            lat: locations[0].lat,
            lng: locations[0].lng,
        }
    };

    return (
        <div className={"container"}>
            <div className={"history-map"}>
                <GoogleMap
                    zoom={13}
                    options={mapOptions}
                    mapContainerClassName={"history-map-container"}>

                    {alertLocations && (
                        <div>
                            {alertLocations.map((l, index) =>
                                <Marker key={index} position={l}/>
                            )}
                        </div>
                    )}

                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse}/>
                    )}

                </GoogleMap>
            </div>
        </div>
    )
}

export default function Map() {
    const mapRef = useRef();
    const [alerts, setAlert] = useState(null);
    const [publicIncidents, setPublicIncidents] = useState(null);
    const [infoWindow, showInfoWindow] = useState(false)
    const [infoWindowContent, setInfoWindowContent] = useState([])
    const [userLocation, setUserLocation] = useState(null);
    const [gardaStations, setGardaStations] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });

        getActiveAlerts().then((alert) => {
            setAlert(alert);
        });

        getAllPublicIncidents().then((r) => {
            setPublicIncidents(r);
        });

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

    const loadNearByGardaStations = () => {
        const request = {
            location: userLocation,
            radius: 2000,
            type: ['police']
        };

        let service = new window.google.maps.places.PlacesService(mapRef.current);
        service.nearbySearch(request, callback);


        let foundGardaStations = []

        function callback(results, status) {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    foundGardaStations.push(results[i])
                    setGardaStations(foundGardaStations)
                }
            }
            //https://developers.google.com/maps/documentation/javascript/places#place_search_requests
        }
    }
    return (
        <div className={"container"}>
            <div className={"map"}>
                {userLocation && (
                    <GoogleMap
                        zoom={13}
                        options={mapOptions}
                        center={userLocation}
                        mapContainerClassName={"map-container"}
                        onLoad={(map) => {
                            mapRef.current = map;
                            loadNearByGardaStations()
                        }}>

                        {userLocation && <Marker
                            icon={{
                                url: (require('../../assets/images/mapImages/userLocation.png')),
                                scaledSize: new window.google.maps.Size(50, 50)
                            }}
                            position={userLocation}/>}
                        {userLocation && <Circle center={userLocation} radius={2000}
                                                 options={circleOptions}/>}

                        {alerts && (
                            <div>
                                {alerts.map((alert) =>
                                    <Marker
                                        icon={{
                                            url: (require('../../assets/images/mapImages/activeAlertIcon.png')),
                                            scaledSize: new window.google.maps.Size(30, 30)
                                        }}
                                        key={alert} position={alert}
                                    />)}
                            </div>

                        )}

                        {publicIncidents && (
                            <div>
                                {publicIncidents.map((index) =>
                                    <Marker icon={{
                                        url: (require('../../assets/images/mapImages/publicAlertIcon.png')),
                                        scaledSize: new window.google.maps.Size(30, 30)
                                    }}
                                            key={index}
                                            position={{lat: index.location._lat, lng: index.location._long}}
                                            onClick={() => {
                                                mapRef.current.panTo({
                                                    lat: index.location._lat,
                                                    lng: index.location._long
                                                })
                                                setInfoWindowContent(index)
                                                showInfoWindow(true)
                                            }}
                                    >
                                    </Marker>
                                )}

                            </div>
                        )}

                        {gardaStations && (
                            <div>
                                {gardaStations.map((index) =>
                                    <Marker
                                        key={index}
                                        position={{
                                            lat: index.geometry.location.lat(),
                                            lng: index.geometry.location.lng()
                                        }}
                                    >
                                    </Marker>
                                )}
                            </div>
                        )}

                        {(infoWindow && infoWindowContent) && (
                            <InfoWindow
                                options={{
                                    position: {
                                        lat: infoWindowContent.location._lat,
                                        lng: infoWindowContent.location._long
                                    },
                                }}
                                onCloseClick={() => {
                                    showInfoWindow(false)
                                    setInfoWindowContent(null)
                                }}
                            >
                                <div>
                                    <h4>An incident Has Occurred In this area!</h4>
                                    <p>Here is a brief description of what happened</p>
                                    <p>{infoWindowContent.incidentReport}</p>
                                </div>

                            </InfoWindow>
                        )}

                    </GoogleMap>

                )}
            </div>
        </div>
    )
}
//https://www.youtube.com/watch?v=2po9_CIRW7I&t=2577s
//https://stackoverflow.com/questions/71423686/how-to-add-custom-ico-or-svg-as-marker-icon-in-react-google-maps-api
//https://udarax.me/technology/how-to-draw-directions-between-2-points-in-the-google-maps-using-react-js/
//https://developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRequest
//https://linuxhint.com/remove-first-and-last-element-in-array-javascript/#:~:text=For%20removing%20the%20first%20and,which%20needs%20to%20be%20removed.