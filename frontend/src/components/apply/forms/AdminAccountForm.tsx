import { useState } from "react";
import ApplicationSuccessState from "../shared/ApplicationSuccessState";
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
};

const initialFormData: AdminAccountFormData = {
  fullName: "",
  email: "",
  contactNo: "",
  currentAffiliation: "",
  reasonForAdminAccess: "",
  supportingNotes: "",
};

const inputClassName =
  "w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500";
const labelClassName = "mb-2 block text-sm font-medium text-slate-700";
const errorClassName = "mt-1 text-sm text-red-600";

const AdminAccountForm = () => {
  const [formData, setFormData] = useState<AdminAccountFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setReferenceNumber(`ADM-${Date.now().toString().slice(-6)}`);
    setSubmitSuccess(true);
    setIsSubmitting(false);
  };

  const handleReturn = () => {
    setFormData(initialFormData);
    setErrors({});
    setReferenceNumber("");
    setSubmitSuccess(false);
    setIsSubmitting(false);
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
            Full Name
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
            Email
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
            Contact Number
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
            Current Affiliation
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

        <div className="md:col-span-2">
          <label htmlFor="reasonForAdminAccess" className={labelClassName}>
            Reason for Admin Access
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
