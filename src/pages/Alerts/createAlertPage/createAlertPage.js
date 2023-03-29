import CreateAlertForm from "../../../components/Forms/createForm/createAlertForm";
import "./createAlertPage.css"
import {ArrowBack} from "@material-ui/icons";
import {useNavigate} from "react-router-dom";

export default function CreateAlertPage() {
    const navigate = useNavigate()

    function handleBack() {
        navigate("/alerts");
    }

    return (
        <div className={"createAlertPage"}>
            <header>
                <ArrowBack onClick={handleBack} fontSize={"large"}/>
            </header>

            <div>
                <p>Create An alert</p>
                <CreateAlertForm/>
            </div>

        </div>
    );
}