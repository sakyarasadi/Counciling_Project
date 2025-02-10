import React, { useEffect, useState , useRef } from "react";
import GetDataService from "../../../../services/http/get-data-services";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarUser from '../../../../components/bootstrap/user_navBar';
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import axios from "axios";

interface Report {
  firstName: string;
  lastName : string;
  email: string;
  nic: string;
  age: string;
}

function Report() {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<Report | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);



  useEffect(() => {
    async function fetchData() {
      const email = localStorage.getItem("email");
      if (!email) {
        setError("Email not found in local storage.");
        return;
      }

      const headers = {
        "X-User-Email": email,
      };

      try {
        const userResult = await GetDataService("/api/get-user", { headers });
        console.log(userResult);
        if (userResult.success) {
          setUser(userResult.data);
        } else {
          setError("Failed to fetch user data.");
        }

        const reportResult = await GetDataService("/api/get-report", { headers });
        if (reportResult.success) {
          setReport(reportResult.data);
        } else {
          setError("Failed to fetch report data.");
        }

        try {
          const response = await axios.get("http://127.0.0.1:5000/api/userpropic", {
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

        setError(null);
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error("Fetch data error:", err);
      }
    }

    fetchData();
  }, []);

  const getVideoLinks = (conditionLinks: string[]) => (
    <div className="d-flex flex-wrap">
      {conditionLinks.map((link, index) => (
        <div key={index} className="p-2">
          <iframe
            width="300"
            height="180"
            src={link.replace("youtu.be/", "www.youtube.com/embed/").split("?")[0]}
            title={`Video ${index + 1}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      ))}
    </div>
  );

  const anxiety_positive = report?.processed_data?.detailed_results?.anxiety_answer_1?.positive_word_count + report?.processed_data?.detailed_results?.anxiety_answer_2?.positive_word_count;
  const anxiety_negative = report?.processed_data?.detailed_results?.anxiety_answer_1?.negative_word_count + report?.processed_data?.detailed_results?.anxiety_answer_2?.negative_word_count;
  const anxietyLinks = anxiety_positive > anxiety_negative
    ? ["https://youtu.be/nBCFnfHnLbM?si=W3hdTdcY1AbMv4Gg", "https://www.youtube.com/live/1arA4Nl70ts?si=WJPUJAdFsic5XOu4","https://www.youtube.com/live/sSER7a1qKjI?si=FZQaOySM2jY_8V-1","https://www.youtube.com/live/u5EWe5baBck?si=2s0T67gIxU2ZCJZ4"]
    : ["https://youtu.be/1ItW5nYUidw?si=NJqbBLbyruebtDru", "https://youtu.be/lAfN7r8K15M?si=EB5OW2n8PltCbx3Q","https://youtu.be/IrhJR--Ok7A?si=N_D05RX-lSfjQ1y4","https://youtu.be/ZXEC0IrOWGk?si=mrbsziYOhJ4ixLNx"];

  const schizophrenia_positive = report?.processed_data?.detailed_results?.schizophrenia_answer_3?.positive_word_count + report?.processed_data?.detailed_results?.schizophrenia_answer_4?.positive_word_count;
  const schizophrenia_negative = report?.processed_data?.detailed_results?.schizophrenia_answer_3?.negative_word_count + report?.processed_data?.detailed_results?.schizophrenia_answer_4?.negative_word_count;
  const schizophreniaLinks = schizophrenia_positive > schizophrenia_negative
    ? ["https://youtu.be/dGEi1PbXSLo?si=96ATrb-70jzEgn5I", "https://youtu.be/jlpNuu09eGo?si=9ll4lJsK5GLniSeu","https://youtu.be/WMJROCcv2_A?si=UxX2cGGc0xbUG39V","https://youtu.be/_Ry2WmTElCM?si=YifukJe6HhF50ATj"]
    : ["https://youtu.be/1ItW5nYUidw?si=NJqbBLbyruebtDru", "https://youtu.be/lAfN7r8K15M?si=EB5OW2n8PltCbx3Q","https://youtu.be/IrhJR--Ok7A?si=N_D05RX-lSfjQ1y4","https://youtu.be/ZXEC0IrOWGk?si=mrbsziYOhJ4ixLNx"];

  const bipolar_positive = report?.processed_data?.detailed_results?.bipolar_answer_9?.positive_word_count + report?.processed_data?.detailed_results?.bipolar_answer_10?.positive_word_count;
  const bipolar_negative = report?.processed_data?.detailed_results?.bipolar_answer_9?.negative_word_count + report?.processed_data?.detailed_results?.bipolar_answer_10?.negative_word_count;
  const bipolarLinks = bipolar_positive > bipolar_negative
    ? ["https://youtu.be/0E53ZZa3Qk8?si=z5gHy9ordvwcJ2rj", "https://youtu.be/oruNljsKT9Q?si=ufmzNvv6040fLZTd","https://youtu.be/NCahU5eOYcI?si=kIzcAXjKEj8RulT7","https://youtu.be/rJad-noS6uw?si=iybRY6s_-7G_fx1Z"]
    : ["https://youtu.be/1ItW5nYUidw?si=NJqbBLbyruebtDru", "https://youtu.be/lAfN7r8K15M?si=EB5OW2n8PltCbx3Q","https://youtu.be/IrhJR--Ok7A?si=N_D05RX-lSfjQ1y4","https://youtu.be/ZXEC0IrOWGk?si=mrbsziYOhJ4ixLNx"];

  const stress_negative = report?.processed_data?.detailed_results?.stress_answer_7?.negative_word_count + report?.processed_data?.detailed_results?.stress_answer_8?.negative_word_count;
  const stress_positive = report?.processed_data?.detailed_results?.stress_answer_7?.positive_word_count + report?.processed_data?.detailed_results?.stress_answer_8?.positive_word_count;
  const stressLinks = stress_positive > stress_negative
    ? ["https://www.youtube.com/live/K9GF_jTwk04?si=e4mr2_Uffq-gvX7S", "https://youtu.be/I3OJUwILelU?si=T-NwiQ7mflHpA14f","https://www.youtube.com/live/SwZ3BfTV9cQ?si=lkHqZ_Z80_ROdHeV","https://youtu.be/HCWvgoTfUjg?si=cz8fLyVhmzc6B5SL"]
    : ["https://youtu.be/1ItW5nYUidw?si=NJqbBLbyruebtDru", "https://youtu.be/lAfN7r8K15M?si=EB5OW2n8PltCbx3Q","https://youtu.be/IrhJR--Ok7A?si=N_D05RX-lSfjQ1y4","https://youtu.be/ZXEC0IrOWGk?si=mrbsziYOhJ4ixLNx"];

  const depression_positive = report?.processed_data?.detailed_results?.depression_answer_5?.positive_word_count + report?.processed_data?.detailed_results?.depression_answer_6?.positive_word_count;
  const depression_negative = report?.processed_data?.detailed_results?.depression_answer_5?.negative_word_count + report?.processed_data?.detailed_results?.depression_answer_6?.negative_word_count;
  const depressionLinks = depression_positive > depression_negative
    ? ["https://youtu.be/3pNpHZ1yv3I?si=IDqznDm4uDVIqusS", "https://youtu.be/VgdAcENXy84?si=Y0h3Lvki_BBMFCnH","https://youtu.be/jNUHb5ZzqLQ?si=jTKo8ZQw3jycTFO0","https://youtu.be/nBCFnfHnLbM?si=pP8TPsktpP6VJYmF"]
    : ["https://youtu.be/1ItW5nYUidw?si=NJqbBLbyruebtDru", "https://youtu.be/lAfN7r8K15M?si=EB5OW2n8PltCbx3Q","https://youtu.be/IrhJR--Ok7A?si=N_D05RX-lSfjQ1y4","https://youtu.be/ZXEC0IrOWGk?si=mrbsziYOhJ4ixLNx"];

  const anxiety_positive1 = report?.processed_data?.detailed_results?.anxiety_answer_1?.positive_word_count + report?.processed_data?.detailed_results?.anxiety_answer_2?.positive_word_count;
  const anxiety_negative1 = report?.processed_data?.detailed_results?.anxiety_answer_1?.negative_word_count + report?.processed_data?.detailed_results?.anxiety_answer_2?.negative_word_count;
  const anxietyLevel = anxiety_positive > anxiety_negative
    ?["He/She is feeling anxious."]
    : ["He/She is not feeling anxious."];

  const schizophrenia_positive1 = report?.processed_data?.detailed_results?.schizophrenia_answer_3?.positive_word_count + report?.processed_data?.detailed_results?.schizophrenia_answer_4?.positive_word_count;
  const schizophrenia_negative1 = report?.processed_data?.detailed_results?.schizophrenia_answer_3?.negative_word_count + report?.processed_data?.detailed_results?.schizophrenia_answer_4?.negative_word_count;
  const schizophreniaLevel = schizophrenia_positive > schizophrenia_negative
    ?["He/She is feeling schizophrenic."]
    : ["He/She is not feeling schizophrenic."];

  const bipolar_positive1 = report?.processed_data?.detailed_results?.bipolar_answer_9?.positive_word_count + report?.processed_data?.detailed_results?.bipolar_answer_10?.positive_word_count;
  const bipolar_negative1 = report?.processed_data?.detailed_results?.bipolar_answer_9?.negative_word_count + report?.processed_data?.detailed_results?.bipolar_answer_10?.negative_word_count;
  const bipolarLevel = bipolar_positive > bipolar_negative
    ?["He/She is feeling bipolar."]
    : ["He/She is not feeling bipolar."];

  const stress_negative1 = report?.processed_data?.detailed_results?.stress_answer_7?.negative_word_count + report?.processed_data?.detailed_results?.stress_answer_8?.negative_word_count;
  const stress_positive1 = report?.processed_data?.detailed_results?.stress_answer_7?.positive_word_count + report?.processed_data?.detailed_results?.stress_answer_8?.positive_word_count;
  const stressLevel = stress_positive > stress_negative
    ?["He/She is feeling stressed."]
    : ["He/She is not feeling stressed."];

  const depression_positive1 = report?.processed_data?.detailed_results?.depression_answer_5?.positive_word_count + report?.processed_data?.detailed_results?.depression_answer_6?.positive_word_count;
  const depression_negative1 = report?.processed_data?.detailed_results?.depression_answer_5?.negative_word_count + report?.processed_data?.detailed_results?.depression_answer_6?.negative_word_count;
  const depressionLevel = depression_positive > depression_negative
    ?["He/She is feeling depressed."]
    : ["He/She is not feeling depressed."];

    const handleGeneratePDF = async () => {
      const userEmail = localStorage.getItem("email");
      console.log(userEmail);
    
      if (!userEmail) {
        Swal.fire("Error", "User email not found in local storage.", "error");
        return;
      }
    
      const doc = new jsPDF();
    
      // User Details Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("User Details", 10, 20);
      doc.setLineWidth(0.5);
      doc.line(10, 22, 60, 22); // Underline
    
      // Add space and user details
      let y = 40;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      if (user) {
        doc.text(`Full Name: ${user.firstName + " " + user.lastName}`, 10, y);
        y += 10;
        doc.text(`Email: ${userEmail}`, 10, y);
        y += 10;
        doc.text(`NIC: ${user.nic}`, 10, y);
        y += 10;
        doc.text(`Age: ${user.age}`, 10, y);
      } else {
        Swal.fire("Error", "User data is not available.", "error");
        return;
      }
      y += 20; // Two-row space
    
      // Mental Level Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Mental Level", 10, y);
      doc.line(10, y + 2, 60, y + 2); // Underline
      y += 20;
    
      // Mental Health Levels
      const mentalLevels = [
        { title: "Anxiety", value: anxietyLevel },
        { title: "Schizophrenia", value: schizophreniaLevel },
        { title: "Bipolar", value: bipolarLevel },
        { title: "Stress", value: stressLevel },
        { title: "Depression", value: depressionLevel },
      ];
    
      doc.setFontSize(14);
      mentalLevels.forEach((level) => {
        doc.setFont("helvetica", "bold");
        doc.text(level.title, 10, y);
        y += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(level.value, 15, y);
        y += 15; // Space between items
      });
    
      y += 20; // Two-row space after mental levels
    
      // Questions and Answers Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Questions and Answers", 10, y);
      doc.line(10, y + 2, 95, y + 2); // Underline
      y += 20;
    
      // Questions and Answers Content
      report.questions.forEach((q: any, index: number) => {
        if (y > 280) { // Check for page overflow
          doc.addPage();
          y = 20; // Reset y-coordinate for the new page
        }
      
        doc.setFontSize(8);
        
        // Add Question
        doc.setFont("helvetica", "bold");
        doc.text(`Q${index + 1}: ${q.question}`, 10, y);
        y += 10; // Move to the next line for the answer
      
        // Add Answer
        doc.setFont("helvetica", "normal");
        doc.text(`A${index + 1}: ${report.answers[index]}`, 10, y);
        y += 10; // Add spacing for the next question-answer pair
      });
      
    
      // Create and upload PDF
      const pdfBlob = doc.output("blob");
      const formData = new FormData();
      if (user) {
        formData.append("file", pdfBlob, `${user.firstName}.pdf`);
        formData.append("email", userEmail);
      } else {
        Swal.fire("Error", "User data is not available.", "error");
        return;
      }
    
      try {
        const response = await axios.post("http://127.0.0.1:5000/api/upload-pdf", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
    
        if (response.data.success) {
          Swal.fire("Success", "PDF uploaded successfully!", "success");
        } else {
          Swal.fire("Error", "Failed to upload PDF.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "An error occurred while uploading PDF.", "error");
        console.error(error);
      }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          setSelectedFile(e.target.files[0]);
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
            "http://127.0.0.1:5000/api/userpropic",
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
    
    
    return (
      <>
       <NavbarUser /> 
      <div className="container mt-5 p-4 ">
        {error && <p className="alert alert-danger">{error}</p>}
        
        <div className="container mt-5 p-4 bg-light rounded shadow">
          <div className="card-body">
            <h3 className="card-title text-center">User Information</h3>
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
            {user ? (
              <div>
                <p><strong>Full Name:</strong> {user.firstName+" "+user.lastName}</p>
                <p><strong>Age:</strong> {user.age}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>NIC:</strong> {user.nic}</p>
              </div>
            ) : (
              <p>Loading user information...</p>
            )
            
            }
              <button className="btn btn-primary" onClick={handleGeneratePDF}>Generate PDF</button>
          </div>
        </div>
        
        <div className="container mt-5 p-4 bg-light rounded shadow">
          <div className="card-body">
            <h3 className="card-title text-center">Report Information</h3>
            {report ? (
              <>
                <h5 className="text-secondary">Questions and Answers</h5>
                {report.questions.map((q: { question: string }, index: number) => (
                  <div key={index} className="mb-2">
                    <strong>{q.question}</strong>
                    <p>{report.answers[index]}</p>
                  </div>
                ))}
                <p><strong>Updated at:</strong> {report.created_at}</p>
                
                <h4 className="text-center mt-4">Video Recommendations</h4>
  
                <div className="mb-4">
                  <h5 className="text-primary">Anxiety</h5>
                  {getVideoLinks(anxietyLinks)}
                </div>
  
                <div className="mb-4">
                  <h5 className="text-primary">Schizophrenia</h5>
                  {getVideoLinks(schizophreniaLinks)}
                </div>
  
                <div className="mb-4">
                  <h5 className="text-primary">Bipolar</h5>
                  {getVideoLinks(bipolarLinks)}
                </div>
  
                <div className="mb-4">
                  <h5 className="text-primary">Stress</h5>
                  {getVideoLinks(stressLinks)}
                </div>
  
                <div className="mb-4">
                  <h5 className="text-primary">Depression</h5>
                  {getVideoLinks(depressionLinks)}
                </div>
              </>
            ) : (
              <p>Loading report information...</p>
            )}
          </div>
        </div>
      </div>
      </>
    );
  }
  
  export default Report;