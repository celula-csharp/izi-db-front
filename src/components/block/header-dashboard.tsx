import Button from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HeaderDashboard() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/student/dashboard');
    };

    return (
        <div className="p-4 bg-[#111318] border-b border-gray-800 flex justify-between items-center">

            {/* Título o Logo de la aplicación */}
            <h1 className="text-xl font-bold text-white">izi-db</h1>

            <Button
                onClick={handleGoHome}
                className="border border-blue-600 text-blue-400 hover:bg-blue-900"
            >
                Dashboard
            </Button>

        </div>
    );
}
