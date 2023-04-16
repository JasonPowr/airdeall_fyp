import {useState} from "react";
import Switch from "@mui/material/Switch";
import {makeStyles} from "@material-ui/core";
import {FacebookLoginButton} from "react-social-login-buttons";

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

function SocialMediaIntegration({handleChange, editAlert, values, isFacebookLinked, handleFacebookLink}) {
    const [socialMediaPermissionsGranted, setSocialMediaPermissionsGranted] = useState(true);
    const classes = useStyles();

    return (
        <div>
            {socialMediaPermissionsGranted ? (

                <div>
                    <div className={classes.outer_sms}>
                        <p>Social Media Integration</p>

                        <Switch
                            onChange={handleChange}
                            id={"socialMediaIntegration.isEnabled"}
                            defaultChecked={editAlert ? editAlert.socialMediaIntegration.isEnabled : false}
                        />
                    </div>

                    {values.socialMediaIntegration.isEnabled && (
                        <div className={classes.border}>
                            <div className={classes.outer_sms}>
                                <p>Facebook</p>

                                <Switch
                                    onChange={handleChange}
                                    id={"socialMediaIntegration.facebook.isEnabled"}
                                    defaultChecked={editAlert ? editAlert.socialMediaIntegration.facebook.isEnabled : false}
                                />
                            </div>

                            {values.socialMediaIntegration.facebook.isEnabled && (
                                <div>
                                    {isFacebookLinked ? (
                                        <div>
                                            <div className={classes.outer_sms}>
                                                <p>Post to Facebook</p>
                                                <Switch
                                                    onChange={handleChange}
                                                    id={"socialMediaIntegration.facebook.isPostEnabled"}
                                                    defaultChecked={editAlert ? editAlert.socialMediaIntegration.facebook.isPostEnabled : false}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <FacebookLoginButton onClick={handleFacebookLink}>Link
                                            Facebook</FacebookLoginButton>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <p>You need to give access to Social Media Accounts</p>
                    <p>Social Media Integration</p>

                    <Switch
                        onChange={handleChange}
                        id={"socialMediaIntegration.isEnabled"}
                        disabled={true}
                        defaultChecked={editAlert ? editAlert.socialMediaIntegration.isEnabled : false}
                    />
                </div>
            )}
        </div>
    );
}

export default SocialMediaIntegration

//https://www.npmjs.com/package/react-social-login-buttons