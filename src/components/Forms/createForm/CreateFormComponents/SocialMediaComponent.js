import {useState} from "react";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";

function SocialMediaIntegration({handleChange, editAlert, values, isFacebookLinked, handleFacebookLink}) {
    const [socialMediaPermissionsGranted, setSocialMediaPermissionsGranted] = useState(true);

    return (
        <div>
            {socialMediaPermissionsGranted ? (
                <div>
                    <p>Social Media Integration</p>

                    <Switch
                        onChange={handleChange}
                        id={"socialMediaIntegration.isEnabled"}
                        defaultChecked={editAlert ? editAlert.socialMediaIntegration.isEnabled : false}
                    />

                    {values.socialMediaIntegration.isEnabled && (
                        <div>
                            <p>Facebook</p>

                            <Switch
                                onChange={handleChange}
                                id={"socialMediaIntegration.facebook.isEnabled"}
                                defaultChecked={editAlert ? editAlert.socialMediaIntegration.facebook.isEnabled : false}
                            />

                            {values.socialMediaIntegration.facebook.isEnabled && (
                                <div>
                                    {isFacebookLinked ? (
                                        <div>
                                            <div>
                                                <p>Post to Facebook</p>

                                                <Switch
                                                    onChange={handleChange}
                                                    id={"socialMediaIntegration.facebook.isPostEnabled"}
                                                    defaultChecked={editAlert ? editAlert.socialMediaIntegration.facebook.isPostEnabled : false}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <Button onClick={handleFacebookLink}>Link Facebook</Button>
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