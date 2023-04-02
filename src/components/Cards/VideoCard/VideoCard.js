import Card from "@mui/material/Card";
import {CardHeader, CardMedia, IconButton} from "@mui/material";
import {ShareRounded} from "@material-ui/icons";

export default function VideoCard({video}) {
    const videoSrc = video[1]

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
        <Card className={"cards"}>
            <CardHeader
                title={"Video"}
                action={
                    <IconButton onClick={handleShare}>
                        <ShareRounded></ShareRounded>
                    </IconButton>
                }/>
            <CardMedia
                component="iframe"
                image={videoSrc}
                allow="web-share"
            />
        </Card>
    )
}

//https://web.dev/web-share/