import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export default function HeaderDashboard() {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate('/dashboard/student/');
    };
    return (_jsxs("div", { className: "p-4 bg-[#111318] border-b border-gray-800 flex justify-between items-center", children: [_jsx("h1", { className: "text-xl font-bold text-white", children: "izi-db" }), _jsx(Button, { onClick: handleGoHome, className: "border border-blue-600 text-blue-400 hover:bg-blue-900", children: "Dashboard" })] }));
}
