import { useFormik } from "formik";

interface RegistrationFormProps {
  btnPressStatusApproval: boolean;
  onSubmitForm: (data: any) => void;
}


export default function FormApproval({
  onSubmitForm,
  btnPressStatusApproval,
}: RegistrationFormProps) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullname: "",
      email: "",
      nic: "",
      age: "",
      password: '',
      confirmPassword: '',
      phoneNumber: "",
      counselorId: "",
      experience: "",
      educationInstitute: "",
      degreeOrDiploma: "",
    },
    validate: (values) => {
      const errors: any = {};

      if (!values.fullname) {
        errors.fullname = "Required";
      }

      if (!values.email) {
        errors.email = "Required";
      }
      if (!values.nic) {
        errors.nic = "Required";
      }
      if (!values.age) {
        errors.age = "Required";
      }
      if (!values.password) {
        errors.password = 'Required';
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = 'Required';
    }
    if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    if(values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
    }
      if (!values.phoneNumber) {
        errors.phoneNumber = "Required";
      }
      if (!values.counselorId) {
        errors.counselorId = "Required";
      }
      if (!values.experience) {
        errors.experience = "Required";
      }
      if (!values.educationInstitute) {
        errors.educationInstitute = "Required";
      }
      if (!values.degreeOrDiploma) {
        errors.degreeOrDiploma = "Required";
      }

      return errors;
    },
    validateOnChange: false,
    onSubmit: (values) => {
      const submittedData = {
        fullname: values.fullname,
        email: values.email,
        nic: values.nic,
        age: values.age,
        password: values.password,
        phoneNumber: values.phoneNumber,
        counselorId: values.counselorId,
        experience: values.experience,
        educationInstitute: values.educationInstitute,
        degreeOrDiploma: values.degreeOrDiploma,
      };

      onSubmitForm(submittedData);
    },
  });

  return (
    <div className={"container pt-5"}>
      <div className={"row pt-5"}>
        <div className="col-12 col-xs-12 col-sm-12 col-md-3 col-lg-4 col-xl-4 col-xxl-4"></div>
        <div className="col-12 col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
          <div className={"card rounded-5"}>
            <div className={"card-header text-center"}>
              <h4 className="text-primary">Counselor Register</h4>
            </div>
            <div className={"card-body"}>
              <form onSubmit={formik.handleSubmit}>
                <div className={"form-floating mb-3 mt-3"}>
                  <input
                    type={"text"}
                    className={"form-control rounded-5"}
                    id={"fullname"}
                    placeholder={"Enter Your Full Name"}
                    name={"fullname"}
                    value={formik.values.fullname}
                    onChange={formik.handleChange}
                  />
                  <label className={"text-primary"} htmlFor={"fullname"}>
                    Full Name
                  </label>
                  {formik.touched.fullname && formik.errors.fullname ? (
                    <div className="text-danger px-3">
                      {formik.errors.fullname}
                    </div>
                  ) : null}
                </div>
                <div className={"form-floating mb-3 mt-3"}>
                  <input
                    type={"email"}
                    className={"form-control rounded-5"}
                    id={"email"}
                    placeholder={"Enter Your Email"}
                    name={"email"}
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  <label className={"text-primary"} htmlFor={"email"}>
                    Email
                  </label>
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-danger px-3">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
                <div className={"form-floating mt-3 mb-3"}>
                  <input
                    type={"text"}
                    className={"form-control rounded-5"}
                    id={"nic"}
                    placeholder={"NIC"}
                    name={"nic"}
                    value={formik.values.nic}
                    onChange={formik.handleChange}
                  />
                  <label className={"text-primary"} htmlFor={"nic"}>
                    NIC
                  </label>
                  {formik.touched.nic && formik.errors.nic ? (
                    <div className="text-danger px-3">{formik.errors.nic}</div>
                  ) : null}
                </div>
                <div className={"form-floating mt-3 mb-3"}>
                  <input
                    type={"text"}
                    className={"form-control rounded-5"}
                    id={"age"}
                    placeholder={"Age"}
                    name={"age"}
                    value={formik.values.age}
                    onChange={formik.handleChange}
                  />
                  <label className={"text-primary"} htmlFor={"age"}>
                    Age
                  </label>
                  {formik.touched.age && formik.errors.age ? (
                    <div className="text-danger px-3">{formik.errors.age}</div>
                  ) : null}
                </div>
                <div className={"form-floating mt-3 mb-3"}>
                  <input
                    type={"password"}
                    className={"form-control rounded-5"}
                    id={"password"}
                    placeholder={"Password"}
                    name={"password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  <label className={"text-primary"} htmlFor={"password"}>
                    Password
                  </label>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-danger px-3">{formik.errors.password}</div>
                  ) : null}
                </div>
                <div className={"form-floating mt-3 mb-3"}>
                  <input
                    type={"password"}
                    className={"form-control rounded-5"}
                    id={"confirmPassword"}
                    placeholder={"Confirm Password"}
                    name={"confirmPassword"}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                  />
                  <label className={"text-primary"} htmlFor={"confirmPassword"}>
                    Confirm Password
                  </label>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                    <div className="text-danger px-3">{formik.errors.confirmPassword}</div>
                  ) : null}
                </div>
                <div className={"form-floating mt-3 mb-3"}>
                  <input
                    type={"text"}
                    className={"form-control rounded-5"}
                    id={"phoneNumber"}
                    placeholder={"Phone Number"}
                    name={"phoneNumber"}
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                  />
                  <label className={"text-primary"} htmlFor={"phoneNumber"}>
                    Phone Number
                  </label>
                  {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                    <div className="text-danger px-3">
                      {formik.errors.phoneNumber}
                    </div>
                  ) : null}
                </div>
                <div className={"form-floating mt-3 mb-3"}>
                  <input
                    type={"text"}
                    className={"form-control rounded-5"}
                    id={"counselorId"}
                    placeholder={"Counselor ID"}
                    name={"counselorId"}
                    value={formik.values.counselorId}
                    onChange={formik.handleChange}
                  />
                  <label className={"text-primary"} htmlFor={"counselorId"}>
                    Counselor ID
                  </label>
                  {formik.touched.counselorId && formik.errors.counselorId ? (
                    <div className="text-danger px-3">
                      {formik.errors.counselorId}
                    </div>
                  ) : null}
                </div>
                <div className={"form-floating mt-3 mb-3"}>
                  <input
                    type={"text"}
                    className={"form-control rounded-5"}
                    id={"experience"}
                    placeholder={"Experience"}
                    name={"experience"}
                    value={formik.values.experience}
                    onChange={formik.handleChange}
                  />
                  <label className={"text-primary"} htmlFor={"experience"}>
                    Experience
                  </label>
                  {formik.touched.experience && formik.errors.experience ? (
                    <div className="text-danger px-3">
                      {formik.errors.experience}
                    </div>
                  ) : null}
                </div>
                <div className={"form-floating mt-3 mb-3"}>
                  <input
                    type={"text"}
                    className={"form-control rounded-5"}
                    id={"educationInstitute"}
                    placeholder={"Education Institute"}
                    name={"educationInstitute"}
                    value={formik.values.educationInstitute}
                    onChange={formik.handleChange}
                  />
                  <label
                    className={"text-primary"}
                    htmlFor={"educationInstitute"}
                  >
                    Education Institute
                  </label>
                  {formik.touched.educationInstitute &&
                  formik.errors.educationInstitute ? (
                    <div className="text-danger px-3">
                      {formik.errors.educationInstitute}
                    </div>
                  ) : null}
                </div>
                <div className={"form-floating mt-3 mb-3"}>
                  <input
                    type={"text"}
                    className={"form-control rounded-5"}
                    id={"degreeOrDiploma"}
                    placeholder={"Degree or Diploma"}
                    name={"degreeOrDiploma"}
                    value={formik.values.degreeOrDiploma}
                    onChange={formik.handleChange}
                  />
                  <label className={"text-primary"} htmlFor={"degreeOrDiploma"}>
                    Degree or Diploma
                  </label>
                  {formik.touched.degreeOrDiploma &&
                  formik.errors.degreeOrDiploma ? (
                    <div className="text-danger px-3">
                      {formik.errors.degreeOrDiploma}
                    </div>
                  ) : null}
                </div>

                {btnPressStatusApproval ? (
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      className={"btn btn-primary w-100 rounded-5"}
                      type={"submit"}
                    >
                      Send request
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
        <div className="col-12 col-xs-12 col-sm-12 col-md-3 col-lg-4 col-xl-4 col-xxl-4"></div>
      </div>
    </div>
  );
}
