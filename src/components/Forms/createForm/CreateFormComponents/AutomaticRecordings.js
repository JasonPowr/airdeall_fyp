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
                    <p>Automatic recordings</p>
                    <Switch
                        onChange={handleChange}
                        id={"automaticRecordings.automaticVideoAndAudioRecording"}
                        defaultChecked={editAlert ? editAlert.automaticRecordings.automaticVideoAndAudioRecording : false}
                    />

                    {values.automaticRecordings.automaticVideoAndAudioRecording && (
                        <div>
                            <p>Transcript of audio</p>
                            <Switch
                                onChange={handleChange}
                                id={"automaticRecordings.audioTranscript"}
                                defaultChecked={editAlert ? editAlert.automaticRecordings.audioTranscript : false}
                            />
                        </div>
                    )}

                </div>
            ) : (
                <div>
                    <p>You need to give access to camera</p>
                    <p>Automatic recording</p>
                    <Switch
                        onChange={handleChange}
                        id={"automaticRecordings.automaticVideoAndAudioRecording"}
                        disabled={true}
                        defaultChecked={editAlert ? editAlert.automaticRecordings.automaticVideoAndAudioRecording : false}
                    />
                </div>
            )}
        </div>
    );
};

export default AutomaticRecordings;