import React from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

function VoiceActivationComponent({
                                      microphonePermissionsGranted,
                                      handleChange,
                                      editAlert,
                                      values,
                                      errors,
                                      touched,
                                      handleBlur
                                  }) {
    return (
        <div>
            {microphonePermissionsGranted ? (
                <div>
                    <p>Voice Activation</p>

                    <Switch
                        onChange={handleChange}
                        id={"voiceActivation.isEnabled"}
                        defaultChecked={editAlert ? editAlert.voiceActivation.isEnabled : false}
                    />

                    {values.voiceActivation.isEnabled && (
                        <div>
                            <p>Activate Alert with Countdown</p>

                            <Switch
                                onChange={handleChange}
                                id={"voiceActivation.voiceActivationForAlertWithCountDown"}
                                disabled={values.voiceActivation.voiceActivationForAlertWithoutCountDown}
                                defaultChecked={editAlert ? editAlert.voiceActivation.voiceActivationForAlertWithCountDown : false}
                            />

                            <p>Or</p>

                            <p>Activate Alert without Countdown</p>

                            <Switch
                                onChange={handleChange}
                                id={"voiceActivation.voiceActivationForAlertWithoutCountDown"}
                                disabled={values.voiceActivation.voiceActivationForAlertWithCountDown}
                                defaultChecked={editAlert ? editAlert.voiceActivation.voiceActivationForAlertWithoutCountDown : false}
                            />

                            {(values.voiceActivation.voiceActivationForAlertWithoutCountDown || values.voiceActivation.voiceActivationForAlertWithoutCountDown) && (
                                <div>
                                    <p>Please enter a passphrase</p>
                                    <TextField
                                        error={!!(errors.voiceActivationPhrase && touched.voiceActivationPhrase)}
                                        label={errors.voiceActivationPhrase && touched.voiceActivationPhrase ? "Invalid Voice Activation Phrase" : "Voice Activation Phrase"}
                                        helperText={errors.voiceActivationPhrase && touched.voiceActivationPhrase ? errors.voiceActivationPhrase : " "}
                                        value={values.voiceActivation.voiceActivationPhrase}
                                        variant="filled"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={"textField"}
                                        id={"voiceActivation.voiceActivationPhrase"}
                                        placeholder={"Voice Activation Phrase"}
                                        InputProps={{
                                            disableUnderline: true,
                                            inputProps: {
                                                style: {
                                                    backgroundColor: 'white',
                                                    borderRadius: '10px'
                                                }
                                            }
                                        }}/>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <p> You need to give access to Microphone </p>
                    <p>Voice Activation</p>

                    <Switch
                        onChange={handleChange}
                        id={"voiceActivation.isEnabled"}
                        disabled={true}
                        defaultChecked={editAlert ? editAlert.voiceActivation.isEnabled : false}
                    />
                </div>
            )}
        </div>
    );
}

export default VoiceActivationComponent;