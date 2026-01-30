import { useState, useEffect } from "react";
import { useUserStore } from "@/store/user/userStore";
import { useUser } from "@/hooks/user/useUser";
import { dummyUser } from "@/data/dummyData";
import "./_contactInfo.scss";

interface ContactInfoProps {
  onSubmit: (contactInfo: {
    name: string;
    email: string;
    phone: string;
  }) => void;
}

const ContactInfo = ({ onSubmit }: ContactInfoProps) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isMockUser = token?.startsWith("mock-user-");
  const { data: userData, isLoading: userLoading } = useUser();
  const user = useUserStore((state) => state.user);

  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    phone: "",
  });

  // Mock user: prefill from dummyData so we don't depend on API
  useEffect(() => {
    if (isMockUser) {
      setContactInfo((prev) => ({
        ...prev,
        name: dummyUser.name,
        email: dummyUser.email,
      }));
    }
  }, [isMockUser]);

  useEffect(() => {
    if (!isMockUser && (user || userData)) {
      setContactInfo((prev) => ({
        ...prev,
        name: user?.name ?? userData?.name ?? "",
        email: user?.email ?? userData?.email ?? "",
      }));
    }
  }, [isMockUser, user, userData]);

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone && cleanPhone.length !== 10) {
      return "Please enter a valid 10-digit phone number";
    }
    return "";
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhone(value);
    setContactInfo((prev) => ({ ...prev, phone: formattedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneError = validatePhone(contactInfo.phone);
    if (phoneError) {
      setErrors((prev) => ({ ...prev, phone: phoneError }));
      return;
    }
    onSubmit(contactInfo);
  };

  const isLoading = !isMockUser && userLoading;
  if (isLoading) {
    return (
      <div className="contact-info">
        <div className="loading">Loading your information...</div>
      </div>
    );
  }

  return (
    <div className="contact-info">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={contactInfo.name}
            onChange={(e) =>
              setContactInfo((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={contactInfo.email}
            onChange={(e) =>
              setContactInfo((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={contactInfo.phone}
            onChange={handlePhoneChange}
            placeholder="(123) 456-7890"
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        <button type="submit" className="submit-button">
          Continue to Confirmation
        </button>
      </form>
    </div>
  );
};

export default ContactInfo;
