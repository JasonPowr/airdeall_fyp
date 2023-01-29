import {UserAuth} from "../../contexts/authContext";
import {useState} from "react";
import {Button, TextField} from "@material-ui/core";
import {Link} from "react-router-dom";
function CreateAlertPage() {
    // const { user, logOut } = UserAuth()
    // const navigate = useNavigate()
    // const [error, setError] = useState("");

    // if(user != null){
    //     console.log(user)
    // }

    return (
        <div>
            <p>Create Alert</p>

            <div>
                <TextField
                    variant="filled"
                    className={"textField"}
                    id={"alertName"}
                    type={"email"}
                    placeholder={"Name of Alert"}/>
            </div>

            <Button>Create</Button>
            <Link to={"/alerts"}><Button>Cancel</Button></Link>
        </div>
    );
}

export default CreateAlertPage;