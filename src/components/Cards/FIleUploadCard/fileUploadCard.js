import Card from "@mui/material/Card";
import {Box, CardContent, CardHeader, Typography} from "@mui/material";
import {Button} from "@material-ui/core";
import "./fileUpload.css"
import {useState} from "react";

export default function FileUploadCard({setFile}) {
    const [fileName, setFileName] = useState(null)

    async function handleFileSet(event) {
        setFileName(event.target.files[0].name)
        if (event.target.files[0].type === "application/pdf") {
            setFile(event.target.files[0])
        } else {
            setFileName("File must be a PDF.....")
        }
    }

    return (
        <Card className={"card"}>
            <CardHeader title={
                <Typography fontSize={20}>{fileName ? fileName : "Upload Proof"}</Typography>
            }
            />
            <CardContent>
                <Box sx={{p: 2, border: '1px dashed grey', height: "120px"}}>
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Upload File
                        <input
                            type="file"
                            hidden
                            onChange={handleFileSet}
                        />
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}

//https://mui.com/material-ui/react-box/
//https://stackoverflow.com/questions/40589302/how-to-enable-file-upload-on-reacts-material-ui-simple-input