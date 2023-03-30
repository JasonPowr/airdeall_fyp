import Card from "@mui/material/Card";
import {CardHeader, CardMedia} from "@mui/material";

export default function VideoCard({video}) {
    const videoSrc = video[1]

    return (
        <Card className={"cards"}>
            <CardHeader
                title={"Video"}/>
            <CardMedia
                component="iframe"
                image={videoSrc}
            />
        </Card>
    )
}