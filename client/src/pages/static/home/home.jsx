import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarUser from "../../../components/bootstrap/user_navBar";
import bannerImage from "../../../pictures/4824.jpg"; // Replace with actual path
import additionalImage from "../../../pictures/home1.png"; // Replace with actual path

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavbarUser />
      <div className="container-fluid p-0">
        <div className="text-center mb-4">
          <img src={bannerImage} alt="Banner" className="img-fluid w-100" style={{ maxHeight: "400px", objectFit: "cover" }} />
        </div>
        <div className="container my-5">
          <div className="row">
            <div className="col-md-6 mb-4">
              <p className="fs-5 text-dark">
                Counselling is a process of helping someone to deal with emotional
                issues by listening, questioning, and reflecting. Talking therapy
                allows people to discuss their problems with trained professionals
                in a peaceful and safe ambiance. The role of a counselor doesn’t
                limit to suggesting you do this or that. Rather they support you
                to speak about your problems in detail to identify the primary
                cause behind them. Furthermore, they develop an action plan to
                help you cope up with the issue or win over it.
              </p>
              <p className="fs-5 text-dark">
                The counselling process involves a step-by-step approach, and the counselor
                conducts it in a way to make sure that the client is comfortable with
                the process.
              </p>
            </div>
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              <div className="ratio ratio-16x9">
                <iframe
                  src="https://www.youtube.com/embed/lLZ-3TSoe9E?si=TKGTrpPsNumc0fkf" // Replace with actual YouTube video ID
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-dark text-white text-center py-5">
          <h3 className="display-6">Connect with us</h3>
          <p className="lead">Follow us on our social media channels and stay updated.</p>
          <p className="lead">Chat with us and release your stress.</p>
        </div>
      </div>
    </>
  );
};

export default HomePage;
