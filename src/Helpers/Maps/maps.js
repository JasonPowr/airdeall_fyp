import React, {useEffect, useState} from "react"
import "./map.css"
import {GoogleMap, Marker} from "@react-google-maps/api";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../firebase";

export function requestLocationPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
        }, () => {
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

export function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                resolve(location);
            },
            error => {
                reject(error);
            }
        );
    });
}

async function getAlerts() {
    const querySnapshot = await getDocs(collection(db, "activeAlerts"));
    const activeAlerts = [];
    querySnapshot.forEach((doc) => {
        activeAlerts.push({
            lat: doc.data().location.alertLocation._lat,
            lng: doc.data().location.alertLocation._long
        })
    });
    return activeAlerts
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
            setUserLocation(location);
        });

        getAlerts().then(alert => {
            setAlert(alert)
        })
    }, []);

    const mapOptions = {
        disableDefaultUI: true,
        center: userLocation,
    };

    return (
        <div className={"container"}>
            <div className={"map"}>
                <GoogleMap
                    zoom={18}
                    options={mapOptions}
                    mapContainerClassName={"map-container"}
                    onLoad={getAlerts}>

                    {userLocation && <Marker position={userLocation}/>}

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
