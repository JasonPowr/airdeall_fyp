import React from 'react';
import {Switch} from "@mui/material";

function AutomaticRecordings({
                                 cameraPermissionsGranted,
                                 microphonePermissionsGranted,
                                 handleChange,
                                 editAlert,
                                 values
                             }) {
    return (
        <div>
            {cameraPermissionsGranted && microphonePermissionsGranted ? (
                <div>
                    <p>Automatic recording</p>
                    <Switch
                        onChange={handleChange}
                        id={"automaticRecording"}
                        defaultChecked={editAlert ? editAlert.automaticRecording : false}
                    />
                </div>
            ) : (
                <div>
                    <p>You need to give access to camera</p>
                    <p>Automatic recording</p>
                    <Switch
                        onChange={handleChange}
                        id={"automaticRecording"}
                        disabled={true}
                        defaultChecked={editAlert ? editAlert.automaticRecording : false}
                    />
                </div>
            )}
        </div>
    );
};

export default AutomaticRecordings;