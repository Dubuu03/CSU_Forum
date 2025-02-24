import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BtnBack = () => {
    const navigate = useNavigate();

    return (
        <ChevronLeft
            size={28}
            color="#333"
            style={{
                cursor: "pointer"
            }}
            onClick={() => navigate(-1)}
        />
    );
};

export default BtnBack;
