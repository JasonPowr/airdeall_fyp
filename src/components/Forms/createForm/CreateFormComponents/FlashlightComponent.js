import React from 'react';
import {Switch} from "@mui/material";

function FlashlightComponent({cameraPermissionsGranted, editAlert, handleChange}) {

    return (
        <div>
            {cameraPermissionsGranted ? (<div>
                <p>Trigger Flashlight</p>

                <Switch
                    onChange={handleChange}
                    id={"flashlight"}
                    defaultChecked={editAlert ? editAlert.flashlight : false}
                />
            </div>) : (<div>
                <p> You need to give access to camera</p>
                <p>Trigger Flashlight</p>
                <Switch
                    onChange={handleChange}
                    id={"flashlight"}
                    disabled={true}
                    defaultChecked={editAlert ? editAlert.flashlight : false}
                />
            </div>)}
        </div>
    );
}

export default FlashlightComponent