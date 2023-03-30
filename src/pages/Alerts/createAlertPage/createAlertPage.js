import CreateAlertForm from "../../../components/Forms/createForm/createAlertForm";
import "./createAlertPage.module.css"
import {ArrowBack} from "@material-ui/icons";
import {useNavigate} from "react-router-dom";
import styles from './createAlertPage.module.css';

export default function CreateAlertPage() {
    const navigate = useNavigate()

    function handleBack() {
        navigate("/alerts");
    }

    return (
        <div className={styles.createAlertPageStyle}>
            <ArrowBack onClick={handleBack} fontSize={"large"}/>
            <CreateAlertForm/>
        </div>
    );
}


//https://www.w3schools.com/react/react_css.asp