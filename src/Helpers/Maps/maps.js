import React, {Component} from "react"
import {GoogleApiWrapper, Map, Marker} from 'google-maps-react';

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

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null
        };
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            error => {
                console.error(error);
            }
        );
    }

    render() {
        const style = {
            width: '100%',
            height: '100%'
        };
        const {lat, lng} = this.state;
        return (
            <Map
                google={this.props.google}
                style={style}
                initialCenter={{
                    lat: lat,
                    lng: lng
                }}
                center={{
                    lat: lat,
                    lng: lng
                }}
                zoom={15}
                disableDefaultUI={true}
            >
                {lat && lng && <Marker position={{lat, lng}}/>}
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
})(MapContainer);

//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
//https://www.npmjs.com/package/google-maps-react