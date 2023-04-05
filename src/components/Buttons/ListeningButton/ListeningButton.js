import {Fab} from "@mui/material";
import {MicOffSharp, MicSharp} from "@material-ui/icons";

export function ListeningButton({isListening, setIsListening}) {


    function handleListenButtonPress() {
        setIsListening(true)
    }

    function handleStopListenButtonPress() {
        setIsListening(false)
    }

    if (isListening) {
        return (
            <Fab size={"large"}>
                <MicSharp onClick={handleStopListenButtonPress}/>
            </Fab>
        )

    }

    if (!isListening) {
        return (
            <Fab size={"large"} onClick={handleListenButtonPress}>
                <MicOffSharp/>
            </Fab>
        )
    }
}


//https://mui.com/material-ui/react-floating-action-button/