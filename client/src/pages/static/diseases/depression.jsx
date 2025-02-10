import React from "react";
import NavbarUser from "../../../components/bootstrap/user_navBar";
import bannerImage1 from "../../../pictures/Depression.PNG"; 
import bannerImage2 from "../../../pictures/Anxiety.jpg"; 
import bannerImage3 from "../../../pictures/BipolarDisorder.jpg";
import bannerImage4 from "../../../pictures/Schizophenia.PNG";
import bannerImage5 from "../../../pictures/Stress.png";

const Anxiety = () => {
  const sections = [
    {
      title: "Depression",
      description1:
        "Depression is a chronic mood disorder that involves feelings of emptiness, sadness, or an inability to feel pleasure, often without a clear reason.",
      description2:
        "It’s more intense and lasting than a day of sadness or 'the blues.' Depression significantly impacts both health and well-being.",
      videoUrl: "https://www.youtube.com/embed/xRxT9cOKiM8?si=qvS5YHfENUtzTqPp",
      imageSrc: bannerImage1,
    },
    {
      title: "Anxiety",
      description1:
        "Anxiety is a feeling of fear or apprehension about future events or situations.",
      description2:
        "Common examples include nervousness before a job interview or a speech, with physical responses like an increased heart rate or muscle tension.",
      videoUrl: "https://www.youtube.com/embed/1v3-PT7vS6A?si=ekZF94AzIxnHgiw3",
      imageSrc: bannerImage2,
    },
    {
      title: "Bipolar Disorder",
      description1:
        "Bipolar disorder is a mental health condition marked by extreme mood swings between emotional highs and lows.",
      description2:
        "These shifts include periods of mania or hypomania (highs) and periods of depression (lows).",
      videoUrl: "https://www.youtube.com/embed/BVywnd9YE4s?si=DHAZzAMGVqtpWWYT",
      imageSrc: bannerImage3,
    },
    {
      title: "Schizophrenia",
      description1:
        "Schizophrenia is a serious mental health condition that impacts how a person thinks, feels, and behaves.",
      description2:
        "It can involve hallucinations, delusions, and disorganized thinking and behavior.",
      videoUrl: "https://www.youtube.com/embed/_iZV-cJjmm0?si=fmIkoIUU5q4SzbCO",
      imageSrc: bannerImage4,
    },
    {
      title: "Stress",
      description1:
        "Stress is a natural human reaction that everyone experiences.",
      description2:
        "It helps you respond to challenges, but too much stress can negatively affect health.",
      videoUrl: "https://www.youtube.com/embed/z6X5oEIg6Ak?si=qhle2GMyNS3foVqk",
      imageSrc: bannerImage5,
    },
  ];

  return (
    <>
      <NavbarUser />

      <div>
        <header className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary my-4">
            Mental Health Conditions
          </h1>
          <p className="text-muted fw-bold fs-5">
            Learn about common mental health conditions and how they affect
            well-being.
          </p>
        </header>

        <div className="container">
          <div className="row">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`col-md-6 mb-5 ${
                  index === sections.length - 1 && sections.length % 2 !== 0
                    ? "mx-auto"
                    : ""
                }`}
              >
                <section className="card shadow-sm border-0 h-100">
                  <div className="row g-0 align-items-center">
                    <div className="col-md-4">
                      <img
                        src={section.imageSrc}
                        alt={`${section.title} Banner`}
                        className="img-fluid rounded-start"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h2 className="card-title fw-bold">{section.title}</h2>
                        <p className="card-text">{section.description1}</p>
                        <p className="card-text">{section.description2}</p>
                        <div className="ratio ratio-16x9 mt-3">
                          <iframe
                            src={section.videoUrl}
                            title={`${section.title} video`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            ))}
          </div>
        </div>

        <footer className="bg-dark text-white text-center py-5">
          <h3 className="display-6">Connect with us</h3>
          <p className="lead">
            Follow us on our social media channels and stay updated.
          </p>
          <p className="lead">Chat with us and release your stress.</p>
        </footer>
      </div>
    </>
  );
};

export default Anxiety;
