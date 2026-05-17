import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ApplicationSuccessState from "../shared/ApplicationSuccessState";
import {
  applicationService,
  getApiErrorMessage,
} from "../../../services/api";
import {
  validateContactNumber,
  validateMinLength,
  validateStudentNumber,
  validateUpMail,
} from "../../../utils/formValidation";

type StudentAccountFormData = {
  fullName: string;
  upMail: string;
  contactNo: string;
  studentNumber: string;
  program: string;
  reasonForRequestingAccount: string;
  password: string;
  confirmPassword: string;
};

const initialFormData: StudentAccountFormData = {
  fullName: "",
  upMail: "",
  contactNo: "",
  studentNumber: "",
  program: "",
  reasonForRequestingAccount: "",
  password: "",
  confirmPassword: "",
};

const inputClassName =
  "w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500";
const labelClassName = "mb-2 block text-sm font-medium text-slate-700";
const errorClassName = "mt-1 text-sm text-red-600";
const requiredAsterisk = <span className="ml-1 text-red-600">*</span>;

const StudentAccountForm = () => {
  const [formData, setFormData] = useState<StudentAccountFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[name];
      return nextErrors;
    });
    setSubmitError("");
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) nextErrors.fullName = "Full Name is required.";
    if (!formData.upMail.trim()) {
      nextErrors.upMail = "UP Mail is required.";
    } else if (!validateUpMail(formData.upMail)) {
      nextErrors.upMail = "Enter a valid UP Mail ending in @up.edu.ph.";
    }
    if (!formData.contactNo.trim()) {
      nextErrors.contactNo = "Contact Number is required.";
    } else if (!validateContactNumber(formData.contactNo)) {
      nextErrors.contactNo = "Enter a valid 11-digit mobile number starting with 09.";
    }
    if (!formData.studentNumber.trim()) {
      nextErrors.studentNumber = "Student Number is required.";
    } else if (!validateStudentNumber(formData.studentNumber)) {
      nextErrors.studentNumber =
        "Student Number must be 9 digits, like 202612345.";
    }
    if (!formData.program.trim()) nextErrors.program = "Program is required.";
    if (!formData.password.trim()) nextErrors.password = "Password is required.";
    if (formData.password.trim() && formData.password.trim().length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }
    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.reasonForRequestingAccount.trim()) {
      nextErrors.reasonForRequestingAccount =
        "Reason for Requesting Account is required.";
    } else if (!validateMinLength(formData.reasonForRequestingAccount, 30)) {
      nextErrors.reasonForRequestingAccount =
        "Reason for Requesting Account must be at least 30 characters.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await applicationService.create({
        type: "student_account",
        fullName: formData.fullName,
        email: formData.upMail,
        contactNo: formData.contactNo,
        password: formData.password,
        details: {
          studentNumber: formData.studentNumber,
          program: formData.program,
          reasonForAccount: formData.reasonForRequestingAccount,
        },
      });

      setReferenceNumber(response?.data?._id || `STU-${Date.now().toString().slice(-6)}`);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(await getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturn = () => {
    setFormData(initialFormData);
    setErrors({});
    setReferenceNumber("");
    setSubmitSuccess(false);
    setIsSubmitting(false);
    setSubmitError("");
  };

  if (submitSuccess) {
    return (
      <ApplicationSuccessState
        applicationTitle="Student Account Application"
        successMessage="Account application received. Pending admin approval"
        refNumber={referenceNumber}
        status="pending"
        onReturn={handleReturn}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="fullName" className={labelClassName}>
            Full Name{requiredAsterisk}
          </label>
          <input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={inputClassName}
          />
          {errors.fullName && <p className={errorClassName}>{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="upMail" className={labelClassName}>
            UP Mail{requiredAsterisk}
          </label>
          <input
            id="upMail"
            name="upMail"
            type="email"
            value={formData.upMail}
            onChange={handleChange}
            className={inputClassName}
            placeholder="juan.delacruz@up.edu.ph"
          />
          {errors.upMail && <p className={errorClassName}>{errors.upMail}</p>}
        </div>

        <div>
          <label htmlFor="contactNo" className={labelClassName}>
            Contact Number{requiredAsterisk}
          </label>
          <input
            id="contactNo"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            className={inputClassName}
            placeholder="09XXXXXXXXX"
          />
          {errors.contactNo && <p className={errorClassName}>{errors.contactNo}</p>}
        </div>

        <div>
          <label htmlFor="studentNumber" className={labelClassName}>
            Student Number{requiredAsterisk}
          </label>
          <input
            id="studentNumber"
            name="studentNumber"
            value={formData.studentNumber}
            onChange={handleChange}
            className={inputClassName}
            placeholder="202612345"
          />
          {errors.studentNumber && (
            <p className={errorClassName}>{errors.studentNumber}</p>
          )}
        </div>

        <div>
          <label htmlFor="program" className={labelClassName}>
            Program{requiredAsterisk}
          </label>
          <input
            id="program"
            name="program"
            value={formData.program}
            onChange={handleChange}
            className={inputClassName}
            placeholder="BS Statistics"
          />
          {errors.program && <p className={errorClassName}>{errors.program}</p>}
        </div>

        <div>
          <label htmlFor="password" className={labelClassName}>
            Password{requiredAsterisk}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className={errorClassName}>{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className={labelClassName}>
            Confirm Password{requiredAsterisk}
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <p className={errorClassName}>{errors.confirmPassword}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="reasonForRequestingAccount" className={labelClassName}>
            Reason for Requesting Account{requiredAsterisk}
          </label>
          <textarea
            id="reasonForRequestingAccount"
            name="reasonForRequestingAccount"
            value={formData.reasonForRequestingAccount}
            onChange={handleChange}
            className={`${inputClassName} min-h-32`}
            placeholder="Explain why you need a student account for the platform."
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.reasonForRequestingAccount ? (
              <p className={errorClassName}>{errors.reasonForRequestingAccount}</p>
            ) : (
              <span />
            )}
            <p className="text-sm text-slate-400">
              {formData.reasonForRequestingAccount.trim().length}/30 minimum
            </p>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Student account requests are reviewed before activation.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-bold text-white shadow-md transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
};

export default StudentAccountForm;
