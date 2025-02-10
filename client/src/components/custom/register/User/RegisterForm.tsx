import { useFormik } from "formik";
import Swal from "sweetalert2";

interface RegistrationFormProps {
  registerBtnPressStatus: boolean;
  onSubmitForm: (data: any) => void;
}

export default function RegisterForm({
  onSubmitForm,
  registerBtnPressStatus,
}: RegistrationFormProps) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      age: "",
      nic: "",
      phoneNumber: "",
      guardianName: "",
      connectionWithUser: "",
      guardianPhoneNumber: "",
    },
    validate: (values) => {
      const errors: any = {};

      if (!values.firstName) {
        errors.firstName = "First name is required";
      }

      if (!values.lastName) {
        errors.lastName = "Last name is required";
      }

      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Confirm password is required";
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (!values.age) {
        errors.age = "Age is required";
      }

      if (!values.nic) {
        errors.nic = "NIC is required";
      }

      if (!values.phoneNumber) {
        errors.phoneNumber = "Phone number is required";
      }

      if (!values.guardianName) {
        errors.guardianName = "Guardian name is required";
      }

      if (!values.connectionWithUser) {
        errors.connectionWithUser = "Connection with user is required";
      }

      if (!values.guardianPhoneNumber) {
        errors.guardianPhoneNumber = "Guardian phone number is required";
      }

      return errors;
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values, { setSubmitting }) => {
      const errors = formik.validateForm(values);

      if (Object.keys(errors).length > 0) {
        Swal.fire({
          icon: "error",
          title: "Validation Errors",
          html: `<ul style="text-align: left;">${Object.values(errors)
            .map((error) => `<li>${error}</li>`)
            .join("")}</ul>`,
        });
      } else {
        // Proceed to submit the form if no errors
        onSubmitForm(values);
      }
      setSubmitting(false);
    },
  });

  return (
    <div className={"container"}>
      <div className={"row pt-2"}>
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className={"card rounded-5"}>
            <div className={"card-header text-center"}>
              <h4 className="text-primary">User Registeration</h4>
            </div>
            <div className={"card-body"}>
              <form className="w-150" onSubmit={formik.handleSubmit}>
                <div className="row">
                  {/* Column 1 */}
                  <div className="col-md-4">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control rounded-5"
                        id="firstName"
                        placeholder="First Name"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                      />
                      <label className="text-primary" htmlFor="firstName">
                        First Name
                      </label>
                      {formik.touched.firstName && formik.errors.firstName ? (
                        <div className="text-danger px-3">
                          {formik.errors.firstName}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control rounded-5"
                        id="email"
                        placeholder="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                      />
                      <label className="text-primary" htmlFor="email">
                        Email
                      </label>
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-danger px-3">
                          {formik.errors.email}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control rounded-5"
                        id="password"
                        placeholder="Password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                      />
                      <label className="text-primary" htmlFor="password">
                        Password
                      </label>
                      {formik.touched.password && formik.errors.password ? (
                        <div className="text-danger px-3">
                          {formik.errors.password}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control rounded-5"
                        id="age"
                        placeholder="Age"
                        name="age"
                        value={formik.values.age}
                        onChange={formik.handleChange}
                      />
                      <label className="text-primary" htmlFor="age">
                        Age
                      </label>
                      {formik.touched.age && formik.errors.age ? (
                        <div className="text-danger px-3">
                          {formik.errors.age}
                        </div>
                      ) : null}
                      </div>
                  </div>

                  {/* Column 2 */}
                  <div className="col-md-4">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control rounded-5"
                        id="lastName"
                        placeholder="Last Name"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                      />
                      <label className="text-primary" htmlFor="lastName">
                        Last Name
                      </label>
                      {formik.touched.lastName && formik.errors.lastName ? (
                        <div className="text-danger px-3">
                          {formik.errors.lastName}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control rounded-5"
                        id="nic"
                        placeholder="NIC"
                        name="nic"
                        value={formik.values.nic}
                        onChange={formik.handleChange}
                      />
                      <label className="text-primary" htmlFor="nic">
                        NIC
                      </label>
                      {formik.touched.nic && formik.errors.nic ? (
                        <div className="text-danger px-3">
                          {formik.errors.nic}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control rounded-5"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                      />
                      <label className="text-primary" htmlFor="confirmPassword">
                        Confirm Password
                      </label>
                      {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword ? (
                        <div className="text-danger px-3">
                          {formik.errors.confirmPassword}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control rounded-5"
                        id="phoneNumber"
                        placeholder="phoneNumber"
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                      />
                      <label className="text-primary" htmlFor="phoneNumber">
                      Phone Number
                      </label>
                      {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                        <div className="text-danger px-3">
                          {formik.errors.phoneNumber}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="col-md-4">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control rounded-5"
                        id="guardianName"
                        placeholder="Guardian Name"
                        name="guardianName"
                        value={formik.values.guardianName}
                        onChange={formik.handleChange}
                      />
                      <label className="text-primary" htmlFor="guardianName">
                        Guardian Name
                      </label>
                      {formik.touched.guardianName &&
                      formik.errors.guardianName ? (
                        <div className="text-danger px-3">
                          {formik.errors.guardianName}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control rounded-5"
                        id="guardianPhoneNumber"
                        placeholder="Guardian Phone Number"
                        name="guardianPhoneNumber"
                        value={formik.values.guardianPhoneNumber}
                        onChange={formik.handleChange}
                      />
                      <label
                        className="text-primary"
                        htmlFor="guardianPhoneNumber"
                      >
                        Guardian Phone Num
                      </label>
                      {formik.touched.guardianPhoneNumber &&
                      formik.errors.guardianPhoneNumber ? (
                        <div className="text-danger px-3">
                          {formik.errors.guardianPhoneNumber}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control rounded-5"
                        id="connectionWithUser"
                        placeholder="Connection With User"
                        name="connectionWithUser"
                        value={formik.values.connectionWithUser}
                        onChange={formik.handleChange}
                      />
                      <label
                        className="text-primary"
                        htmlFor="connectionWithUser"
                      >
                        Connection With User
                      </label>
                      {formik.touched.connectionWithUser &&
                      formik.errors.connectionWithUser ? (
                        <div className="text-danger px-3">
                          {formik.errors.connectionWithUser}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  {registerBtnPressStatus ? (
                    <div className="spinner-border text-primary"></div>
                  ) : (
                    <button
                      className="btn btn-primary w-100 rounded-5"
                      type="submit"
                    >
                      Register Here
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className={"card-footer text-center"}>
              <h6>
                Already have an account? <br />{" "}
                <a href={"/login"}>Login Here</a>
              </h6>
            </div>
          </div>
        </div>
        <div className=""></div>
      </div>
    </div>
  );
}
