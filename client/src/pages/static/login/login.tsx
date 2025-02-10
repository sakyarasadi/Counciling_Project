import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import LoginForm from "../../../components/custom/login/login";
import PostDataService from "../../../services/http/post-data-services";

interface LoginResponseData {
    nickName: string;
    email: string;
    role: "user" | "Counselor_Psychiatrist" | "Admin";
    session: number;
    sessionExp: string;
    status: "online" | "offline";
}

export default function Login() {
    const [cookies, setCookie] = useCookies<any>(["NickName"]);
    const [btnPressStatus, setBtnPressStatus] = useState<boolean>(false);
    const [data, setData] = useState<LoginResponseData | null>(null);

    const navigate = useNavigate();

    const handleFormSubmit = async (formData: any) => {
        setBtnPressStatus(true);
        try {
            const res = await PostDataService("/login", {
                email: formData.email,
                password: formData.password,
            });

            console.log("Full response:", res);

            if (res.success && res.status === 200) {
                // Handle successful login
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: res.message?.title || "Logged in Successfully",
                    showConfirmButton: false,
                    timer: 1500,
                });

                const userData = res.data || {};

                localStorage.setItem("token", userData.token);
                localStorage.setItem("email", userData.email);
                localStorage.setItem("fullname", userData.fullname);               

                console.log(userData.token);
                console.log(userData.email);
                console.log(userData.fullname);

                setCookie("NickName", userData.nickName || "");
                setCookie("Email", userData.email || "");
                setCookie("Role", userData.role || "");
                setCookie("Session", userData.session || "");
                setCookie("SessionExp", userData.sessionExp || "");

                switch (userData.role) {
                    case "User":
                        navigate("/");
                        break;
                    case "Counselor_Psychiatrist":
                        navigate("/profile_cp");
                        break;
                    case "Admin":
                        navigate("/approval-list");
                        break;
                    default:
                        console.warn("Unhandled role:", userData.role);
                        break;
                }
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: res.message?.title || "Login Error",
                    text: res.message?.message || "An error occurred while logging in.",
                    showConfirmButton: true,
                });
            }
        } catch (error: any) {
            console.error("Login error:", error);

            const errorMessage =
                error.response?.data?.message?.message || "Please check your connection and try again.";

            Swal.fire({
                position: "center",
                icon: "error",
                title: error.response?.data?.message?.title || "Network Error",
                text: errorMessage,
                showConfirmButton: true,
            });
        } finally {
            setBtnPressStatus(false);
        }
    };

    return (
        <div className="container-fluid vh-100 text-light bg-primary-subtle">
        <LoginForm
            onSubmitForm={handleFormSubmit}
            loginBtnPressStatus={btnPressStatus}
        />
    </div>
    );
}
