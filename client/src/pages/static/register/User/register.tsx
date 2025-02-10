import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import RegisterForm from "../../../../components/custom/register/User/RegisterForm";
import PostDataService from "../../../../services/http/post-data-services";

export default function Register() {
    const navigate = useNavigate();
    const [btnPressStatus, setBtnPressStatus] = useState<boolean>(false);

    const handleFormSubmit = async (data: any) => {
        setBtnPressStatus(true);
        try {
            const res = await PostDataService('/register', data);
            console.log(res);
            setBtnPressStatus(false);

            if (res.status === 201) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Successfully Registered!",
                    showConfirmButton: false,
                    timer: 1500,
                });

                navigate("/login");
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: res.data.message || "Registration Error",
                    text: res.data.detail || "An error occurred while registering.",
                    showConfirmButton: true,
                });
            }
        } catch (error) {
            setBtnPressStatus(false);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Network Error",
                text: "Please check your connection and try again.",
                showConfirmButton: true,
            });
        }
    };

    return (
        <div className="container-fluid vh-100 text-light bg-primary-subtle">
            <RegisterForm onSubmitForm={handleFormSubmit} registerBtnPressStatus={btnPressStatus} />
        </div>
    );
}
