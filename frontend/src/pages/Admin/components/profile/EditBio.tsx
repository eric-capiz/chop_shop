import { useState } from "react";
import { useUpdateProfile } from "@hooks/admin/useProfile";
import { BarberProfile } from "@/types/auth.types";
import { FaSave, FaTimes } from "react-icons/fa";

interface EditBioProps {
  profile: BarberProfile;
  onClose: () => void;
}

const EditBio = ({ profile, onClose }: EditBioProps) => {
  const updateProfile = useUpdateProfile();
  const initialBio = profile.bio ?? "";
  const [bio, setBio] = useState(initialBio);
  const [charCount, setCharCount] = useState(initialBio.length);
  const MAX_CHARS = 500;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setBio(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ bio });
      onClose();
    } catch (error) {
      console.error("Failed to update bio:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form edit-bio">
      <div className="form-group">
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          value={bio}
          onChange={handleChange}
          rows={6}
          placeholder="Tell us about yourself and your barbering experience..."
        />
        <div className="char-count">
          <span className={charCount >= MAX_CHARS ? "limit-reached" : ""}>
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn-save"
          disabled={updateProfile.isPending || bio.trim() === ""}
        >
          <FaSave /> Save
        </button>
        <button type="button" className="btn-cancel" onClick={onClose}>
          <FaTimes /> Cancel
        </button>
      </div>
    </form>
  );
};

export default EditBio;
