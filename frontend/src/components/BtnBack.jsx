import { useNavigate } from "react-router-dom";
import back from "../assets/back.png";

const BtnBack = () => {
    const navigate = useNavigate();
    return (
        <img
            src={back}
            alt="Back"
            style={{
                width: "20px",
                height: "auto",
                cursor: "pointer",
                position: "absolute",
                left: "20px",
                top: "50px",
            }}
            onClick={() => navigate(-1)}
        />
    );
};

export default BtnBack;