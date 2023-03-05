import React, {useEffect, useState} from "react"
import "./map.css"
import {Circle, GoogleMap, Marker} from "@react-google-maps/api";
import {collection, doc, GeoPoint, getDocs, updateDoc} from "firebase/firestore";
import {auth, db} from "../../firebase";

export function requestLocationPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    updateLocationInDb(position.coords.latitude, position.coords.longitude)
                } else {
                    // User is signed out.
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
            position => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                resolve(location);
                updateLocationInDb(position.coords.latitude, position.coords.longitude)
            },
            error => {
                reject(error);
            }
        );
    });
}

async function updateLocationInDb(lat, lng) {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
        location: new GeoPoint(lat, lng)
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
            updateLocationInDb(position.coords.latitude, position.coords.longitude)
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
                    onLoad={getAlerts}>

                    {userLocation && <Marker position={userLocation}/>}
                    {userLocation && <Circle center={userLocation} radius={2000} options={circleOptions}/>}
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
