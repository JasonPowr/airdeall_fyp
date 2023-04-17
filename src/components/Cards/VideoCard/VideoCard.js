import Card from "@mui/material/Card";
import {CardContent, CardMedia, IconButton} from "@mui/material";
import {ShareRounded} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core";


const useStyles = makeStyles({
    card: {
        maxWidth: "500px",
        width: "80%",
        margin: "auto",
    },
    card_content: {
        display: "flex",
        justifyContent: "space-between"
    },
    card_video: {
        height: "300px"
    }
})


export default function VideoCard({video}) {
    const videoSrc = video[1]
    const classes = useStyles();

    function handleShare() {
        if (navigator.share) {
            navigator.share({
                title: 'Share Video',
                text: 'Check out this video',
                url: videoSrc,
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        }
    }

    return (
        <Card className={classes.card}>
            <CardMedia
                component="video"
                image={videoSrc}
                allow="web-share"
                controls
                className={classes.card_video}
            />
            <CardContent className={classes.card_content}>
                <h3>Alert Recording</h3>
                <IconButton onClick={handleShare}>
                    <ShareRounded></ShareRounded>
                </IconButton>

            </CardContent>
        </Card>
    )
}

//https://web.dev/web-share/
//https://smartdevpreneur.com/four-examples-of-material-ui-cardmedia/
//https://mui.com/material-ui/react-card/
