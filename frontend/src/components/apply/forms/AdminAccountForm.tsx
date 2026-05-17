import { useState } from "react";
import ApplicationSuccessState from "../shared/ApplicationSuccessState";
import {
  applicationService,
  getApiErrorMessage,
} from "../../../services/api";
import {
  validateContactNumber,
  validateEmail,
  validateMinLength,
} from "../../../utils/formValidation";

type AdminAccountFormData = {
  fullName: string;
  email: string;
  contactNo: string;
  currentAffiliation: string;
  reasonForAdminAccess: string;
  supportingNotes: string;
  password: string;
  confirmPassword: string;
};

const initialFormData: AdminAccountFormData = {
  fullName: "",
  email: "",
  contactNo: "",
  currentAffiliation: "",
  reasonForAdminAccess: "",
  supportingNotes: "",
  password: "",
  confirmPassword: "",
};

const inputClassName =
  "w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500";
const labelClassName = "mb-2 block text-sm font-medium text-slate-700";
const errorClassName = "mt-1 text-sm text-red-600";
const requiredAsterisk = <span className="ml-1 text-red-600">*</span>;

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

const AdminAccountForm = () => {
  const [formData, setFormData] = useState<AdminAccountFormData>(initialFormData);
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
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!formData.contactNo.trim()) {
      nextErrors.contactNo = "Contact Number is required.";
    } else if (!validateContactNumber(formData.contactNo)) {
      nextErrors.contactNo = "Enter a valid 11-digit mobile number starting with 09.";
    }
    if (!formData.currentAffiliation.trim()) {
      nextErrors.currentAffiliation = "Current Affiliation is required.";
    }
    if (!formData.reasonForAdminAccess.trim()) {
      nextErrors.reasonForAdminAccess = "Reason for Admin Access is required.";
    } else if (!validateMinLength(formData.reasonForAdminAccess, 50)) {
      nextErrors.reasonForAdminAccess =
        "Reason for Admin Access must be at least 50 characters.";
    }
    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
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
        type: "admin_account",
        fullName: formData.fullName,
        email: formData.email,
        contactNo: formData.contactNo,
        password: formData.password,
        details: {
          affiliation: formData.currentAffiliation,
          reasonForAdminAccess: formData.reasonForAdminAccess,
          supportingNotes: formData.supportingNotes,
        },
      });

      setReferenceNumber(response?.data?._id || `ADM-${Date.now().toString().slice(-6)}`);
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
        applicationTitle="Admin Account Application"
        successMessage="Admin access application received. Pending review by existing admins"
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
          <label htmlFor="email" className={labelClassName}>
            Email{requiredAsterisk}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClassName}
            placeholder="name@example.com"
          />
          {errors.email && <p className={errorClassName}>{errors.email}</p>}
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

        <div className="md:col-span-2">
          <label htmlFor="currentAffiliation" className={labelClassName}>
            Current Affiliation{requiredAsterisk}
          </label>
          <input
            id="currentAffiliation"
            name="currentAffiliation"
            value={formData.currentAffiliation}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Faculty, Staff, Student, or unit affiliation"
          />
          {errors.currentAffiliation && (
            <p className={errorClassName}>{errors.currentAffiliation}</p>
          )}
        </div>

        {/* Password */}
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
              className={`${inputClassName} pr-10`}
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {errors.password && <p className={errorClassName}>{errors.password}</p>}
        </div>

        {/* Confirm Password */}
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
              className={`${inputClassName} pr-10`}
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showConfirmPassword} />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className={errorClassName}>{errors.confirmPassword}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="reasonForAdminAccess" className={labelClassName}>
            Reason for Admin Access{requiredAsterisk}
          </label>
          <textarea
            id="reasonForAdminAccess"
            name="reasonForAdminAccess"
            value={formData.reasonForAdminAccess}
            onChange={handleChange}
            className={`${inputClassName} min-h-32`}
            placeholder="Describe the responsibilities that require admin access."
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.reasonForAdminAccess ? (
              <p className={errorClassName}>{errors.reasonForAdminAccess}</p>
            ) : (
              <span />
            )}
            <p className="text-sm text-slate-400">
              {formData.reasonForAdminAccess.trim().length}/50 minimum
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="supportingNotes" className={labelClassName}>
            Supporting Notes
          </label>
          <textarea
            id="supportingNotes"
            name="supportingNotes"
            value={formData.supportingNotes}
            onChange={handleChange}
            className={`${inputClassName} min-h-28`}
            placeholder="Optional context or supporting information."
          />
        </div>
      </div>

      {submitError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Admin access requires manual verification before activation.
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

export default AdminAccountForm;