import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BtnBack = () => {
    const navigate = useNavigate();

    return (
        <ChevronLeft
            size={24}
            color="#333"
            style={{
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
