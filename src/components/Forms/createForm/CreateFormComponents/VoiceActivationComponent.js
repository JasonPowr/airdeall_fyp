import React from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    outer_sms: {
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between"
    },
    border: {
        border: "3px solid white",
        paddingTop: "25px",
        paddingBottom: "25px",
        borderRadius: "30px",
        width: "90%",
        maxWidth: "600px",
        margin: "auto",
    }
})


function VoiceActivationComponent({
                                      microphonePermissionsGranted,
                                      handleChange,
                                      editAlert,
                                      values,
                                      errors,
                                      touched,
                                      handleBlur
                                  }) {
    const classes = useStyles();
    return (
        <div>
            {microphonePermissionsGranted ? (
                <div>

                    <div className={classes.outer_sms}>
                        <p>Voice Activation Options</p>

                        <Switch
                            onChange={handleChange}
                            id={"voiceActivation.isEnabled"}
                            defaultChecked={editAlert ? editAlert.voiceActivation.isEnabled : false}
                        />
                    </div>

                    {values.voiceActivation.isEnabled && (
                        <div className={classes.border}>
                            <p>Activate Alert with Countdown</p>

                            <Switch
                                onChange={handleChange}
                                id={"voiceActivation.voiceActivationForAlertWithCountDown"}
                                disabled={values.voiceActivation.voiceActivationForAlertWithoutCountDown}
                                defaultChecked={editAlert ? editAlert.voiceActivation.voiceActivationForAlertWithCountDown : false}
                            />

                            <p>Activate Alert without Countdown</p>

                            <Switch
                                onChange={handleChange}
                                id={"voiceActivation.voiceActivationForAlertWithoutCountDown"}
                                disabled={values.voiceActivation.voiceActivationForAlertWithCountDown}
                                defaultChecked={editAlert ? editAlert.voiceActivation.voiceActivationForAlertWithoutCountDown : false}
                            />

                            {(values.voiceActivation.voiceActivationForAlertWithoutCountDown || values.voiceActivation.voiceActivationForAlertWithCountDown) && (
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
                <div className={classes.outer_sms}>
                    <p>Microphone is not enabled</p>
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