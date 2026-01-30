import { useState, useEffect } from "react";
import { useUserStore } from "@/store/user/userStore";
import { useUser } from "@/hooks/user/useUser";
import "./_contactInfo.scss";

interface ContactInfoProps {
  onSubmit: (contactInfo: {
    name: string;
    email: string;
    phone: string;
  }) => void;
}

const ContactInfo = ({ onSubmit }: ContactInfoProps) => {
  const { data: userData, isLoading: userLoading } = useUser();
  const user = useUserStore((state) => state.user) as { name?: string; email?: string } | null;

  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    phone: "",
  });

  useEffect(() => {
    const name = user?.name ?? userData?.name ?? "";
    const email = user?.email ?? (userData as { email?: string })?.email ?? "";
    if (name || email) {
      setContactInfo((prev) => ({
        ...prev,
        name: name || prev.name,
        email: email || prev.email,
      }));
    }
  }, [user, userData]);

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

  if (userLoading) {
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
