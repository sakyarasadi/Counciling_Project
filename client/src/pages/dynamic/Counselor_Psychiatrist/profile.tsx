import React, { useEffect, useState , useRef} from "react";
import GetDataService from "../../../services/http/get-data-services";
import StatusBar from "../../../components/custom/CheckStatus/checkStatus";
import NavCouncilor from "../../../components/bootstrap/navbarCouncilor";
import PostDataService from "../../../services/http/post-data-services";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import "./ProfilePage.css";

interface Profile {
  fullname: string;
  email: string;
  nic: string;
  age: string;
  phoneNumber: string;
  counselorId: string;
  experience: string;
  educationInstitute: string;
  degreeOrDiploma: string;
  profilePicture?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const email = localStorage.getItem("email");
      if (!email) {
        setError("Email not found in local storage.");
        return;
      }

      const headers = { "X-User-Email": email };
      const result = await GetDataService("/counselor", { headers });

      if (result.success) {
        setProfile(result.data);
        setError(null);
      } else {
        setError(result.message.message || "Failed to fetch profile.");
      }

      try {
        const response = await axios.get("http://127.0.0.1:5000/api/propic", {
          params: { email },
        });
        if (response.data.success) {
          setProfilePictureUrl(response.data.url);
        } else {
          setProfilePictureUrl(null);
        }
      } catch {
        setProfilePictureUrl(null);
      }
    }

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setEditedProfile({ ...profile! });
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedProfile) {
      const { id, value } = e.target;
      setEditedProfile((prev) => ({
        ...prev!,
        [id]: value,
      }));
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveChanges = async () => {
    if (!editedProfile) return;

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    };

    const result = await PostDataService("/counselor/update", editedProfile, {
      headers,
    });

    if (result.success) {
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      const email = localStorage.getItem("email");
      if (email) {
        const headers = {
          "X-User-Email": email,
        };
        const fetchResult = await GetDataService("/counselor", { headers });
        if (fetchResult.success) {
          setProfile(fetchResult.data);
        }
      }

      setShowModal(false);
    } else {
      Swal.fire({
        title: "Error!",
        text: result.message.message || "Failed to update profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire("Error", "Please select a file first.", "error");
      return;
    }

    const email = localStorage.getItem("email");
    if (!email) {
      Swal.fire("Error", "Email not found in local storage.", "error");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("email", email);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/propic",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        Swal.fire("Success", "Profile picture updated successfully.", "success");
        setProfilePictureUrl(response.data.url);
        setSelectedFile(null); // Clear state
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset the input field
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to upload profile picture.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  if (error) {
    return <div className="text-center">Error: {error}</div>;
  }

  if (!profile) return <div className="text-center">Loading...</div>;

  return (
    <>
      <NavCouncilor />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Profile</h1>
        <form className="bg-light p-4 rounded shadow-sm">
          <div className="row">
            <div className="text-center mb-4">
              <div className="profile-picture mx-auto">
                {profilePictureUrl ? (
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="img-fluid rounded-circle"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="default-placeholder d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white"
                    style={{ width: "150px", height: "150px", fontSize: "24px" }}
                  >
                    No Picture
                  </div>
                )}
              </div>
              <div className="mt-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="form-control d-inline-block"
                  style={{ maxWidth: "300px" }}
                />
              </div>
              <div className="mt-2">
                <button
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Profile Picture"}
                </button>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="fullname" className="form-label">
                Fullname
              </label>
              <input
                type="text"
                className="form-control"
                id="fullname"
                value={profile.fullname}
                readOnly
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={profile.email}
                readOnly
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="nic" className="form-label">
                NIC
              </label>
              <input
                type="text"
                className="form-control"
                id="nic"
                value={profile.nic}
                readOnly
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="age" className="form-label">
                Age
              </label>
              <input
                type="text"
                className="form-control"
                id="age"
                value={profile.age}
                readOnly
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                value={profile.phoneNumber}
                readOnly
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="counselorId" className="form-label">
                Counselor/Psychiatrist ID
              </label>
              <input
                type="text"
                className="form-control"
                id="counselorId"
                value={profile.counselorId}
                readOnly
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="experience" className="form-label">
                Experience
              </label>
              <input
                type="text"
                className="form-control"
                id="experience"
                value={profile.experience}
                readOnly
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="educationInstitute" className="form-label">
                Education Institute
              </label>
              <input
                type="text"
                className="form-control"
                id="educationInstitute"
                value={profile.educationInstitute}
                readOnly
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="degreeOrDiploma" className="form-label">
              Degree / Diploma
            </label>
            <input
              type="text"
              className="form-control"
              id="degreeOrDiploma"
              value={profile.degreeOrDiploma}
              readOnly
            />
          </div>
          <div className="text-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleEditClick}
            >
              Update Profile
            </button>
          </div>
        </form>

        <div className="mt-4 mb-4">
          <StatusBar email={profile.email} />
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="fullname" className="mb-3">
              <Form.Label>Fullname</Form.Label>
              <Form.Control
                type="text"
                value={editedProfile?.fullname || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editedProfile?.email || ""}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="nic" className="mb-3">
              <Form.Label>NIC</Form.Label>
              <Form.Control
                type="text"
                value={editedProfile?.nic || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="age" className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="text"
                value={editedProfile?.age || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={editedProfile?.phoneNumber || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="counselorId" className="mb-3">
              <Form.Label>Counselor/Psychiatrist ID</Form.Label>
              <Form.Control
                type="text"
                value={editedProfile?.counselorId || ""}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="experience" className="mb-3">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                type="text"
                value={editedProfile?.experience || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="educationInstitute" className="mb-3">
              <Form.Label>Education Institute</Form.Label>
              <Form.Control
                type="text"
                value={editedProfile?.educationInstitute || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="degreeOrDiploma" className="mb-3">
              <Form.Label>Degree / Diploma</Form.Label>
              <Form.Control
                type="text"
                value={editedProfile?.degreeOrDiploma || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfilePage;
