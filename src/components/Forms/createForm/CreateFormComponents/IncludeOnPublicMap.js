import React from 'react';
import {Switch} from "@mui/material";

function IncludeOnPublicMap({geoLocationPermissionsGranted, editAlert, handleChange}) {

    return (
        <div>
            {geoLocationPermissionsGranted ? (<div><p>Include On Public map</p>

                <Switch
                    type={"checkbox"}
                    defaultChecked={editAlert ? editAlert.includeOnPublicMap : false}
                    onChange={handleChange}
                    color={"error"}
                    id={"includeOnPublicMap"}
                /></div>) : (<div>

                <p>You need to allow us to access you location</p>
                <p>Include On Public map</p>

                <Switch
                    type={"checkbox"}
                    defaultChecked={editAlert ? editAlert.includeOnPublicMap : false}
                    disabled={true}
                    onChange={handleChange}
                    id={"includeOnPublicMap"}
                /></div>)}

        </div>
    );
}

export default IncludeOnPublicMap