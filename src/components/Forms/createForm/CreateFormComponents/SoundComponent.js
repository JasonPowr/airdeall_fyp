import React from 'react';
import {Switch} from "@mui/material";

function SoundComponent({handleChange, editAlert}) {

    return (
        <div>
            <p>Sound Alarm</p>

            <Switch
                onChange={handleChange}
                id={"alarm"}
                defaultChecked={editAlert ? editAlert.alarm : false}
            />
        </div>
    );
}

export default SoundComponent