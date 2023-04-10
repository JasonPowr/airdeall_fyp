import React, {useEffect, useState} from "react"
import "./map.css"
import {Circle, DirectionsRenderer, GoogleMap, Marker} from "@react-google-maps/api";
import {getActiveAlerts, updateLocationInDb} from "../../model/db/DB";
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

                    {/*{alertLocations && (*/}
                    {/*    <div>*/}
                    {/*        {alertLocations.map((l, index) =>*/}
                    {/*            <Marker key={index} position={l}/>*/}
                    {/*        )}*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse}/>
                    )}

                </GoogleMap>
            </div>
        </div>
    )
}

export default function Map() {
    const [userLocation, setUserLocation] = useState(null);
    const [alerts, setAlert] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            // updateLocationInDb(position.coords.latitude, position.coords.longitude)
            setUserLocation(location);
        });

        getActiveAlerts().then(alert => {
            setAlert(alert)
        })

    }, []);

    const mapOptions = {
        disableDefaultUI: true,
        center: userLocation,
    };

    const circleOptions = {
        visible: true,
        clickable: false,
        editable: false,
        draggable: false,
        strokeWeight: 2,
        strokeOpacity: 0.5
    }

    return (
        <div className={"container"}>
            <div className={"map"}>

                <GoogleMap
                    zoom={13}
                    options={mapOptions}
                    mapContainerClassName={"map-container"}
                    onLoad={getActiveAlerts}>

                    {userLocation && <Marker position={userLocation}/>}
                    {userLocation && <Circle center={userLocation} radius={2000}
                                             options={circleOptions}/>}

                    {alerts && (
                        <div>
                            {alerts.map((alert) =>
                                <Marker position={alert}/>)}
                        </div>
                    )}
                </GoogleMap>
            </div>
        </div>
    )
}
//https://udarax.me/technology/how-to-draw-directions-between-2-points-in-the-google-maps-using-react-js/
//https://developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRequest
//https://linuxhint.com/remove-first-and-last-element-in-array-javascript/#:~:text=For%20removing%20the%20first%20and,which%20needs%20to%20be%20removed.