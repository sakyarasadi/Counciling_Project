import { useFormik } from "formik";

interface LoginFormProps {
  loginBtnPressStatus: boolean;
  onSubmitForm: (data: any) => void;
}

export default function LoginForm({ onSubmitForm, loginBtnPressStatus }: LoginFormProps) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: { email?: string; password?: string } = {};
      if (!values.email) errors.email = 'Required';
      if (!values.password) errors.password = 'Required';
      return errors;
    },
    validateOnChange: false,
    onSubmit: async (values) => {
      const submittedData = { email: values.email, password: values.password };
      await onSubmitForm(submittedData);
      formik.resetForm();
    },
  });

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="col-12 col-sm-8 col-md-6 col-lg-5">
        <div className="card shadow-lg rounded-4 border-0">
          <div className="card-header bg-primary text-white text-center rounded-top-4">
            <h3>Login</h3>
          </div>
          <div className="card-body px-5">
            <form onSubmit={formik.handleSubmit}>
              <div className="form-floating mb-4">
                <input
                  type="email"
                  className="form-control rounded-4"
                  id="email"
                  placeholder="Enter your email"
                  name="email"
                  autoComplete="username"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                <label htmlFor="email" className="text-secondary">Email</label>
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-danger mt-1">{formik.errors.email}</div>
                ) : null}
              </div>
              <div className="form-floating mb-4">
                <input
                  type="password"
                  className="form-control rounded-4"
                  id="password"
                  placeholder="Enter your password"
                  name="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                <label htmlFor="password" className="text-secondary">Password</label>
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-danger mt-1">{formik.errors.password}</div>
                ) : null}
              </div>

              {loginBtnPressStatus ? (
                <div className="text-center mb-3">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : (
                <button
                  className="btn btn-primary w-100 rounded-4 shadow-sm"
                  type="submit"
                >
                  Login
                </button>
              )}
            </form>
          </div>
          <div className="card-footer bg-light rounded-bottom-4 text-center">
            <p className="mb-0">
              Don’t have an account? <a href="/register" className="text-primary fw-bold">Register Here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
