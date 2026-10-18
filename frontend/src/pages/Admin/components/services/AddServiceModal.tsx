import { useState } from "react";
import { useAddService } from "@hooks/admin/useService";
import { FaTimes } from "react-icons/fa";
import "./_serviceModals.scss";

interface AddServiceModalProps {
  onClose: () => void;
}

const AddServiceModal = ({ onClose }: AddServiceModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("haircut");

  const addService = useAddService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addService.mutateAsync({
        name,
        description,
        duration: Number(duration),
        price: Number(price),
        category,
      });
      onClose();
    } catch (error) {
      console.error("Failed to add service:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Service</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-group">
            <label htmlFor="name">Service Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration (minutes):</label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($):</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="manicure">Manicure</option>
              <option value="pedicure">Pedicure</option>
              <option value="extensions">Extensions</option>
              <option value="nail-art">Nail Art</option>
              <option value="combo">Combo</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-save"
              disabled={addService.isPending}
            >
              {addService.isPending ? "Adding..." : "Add Service"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
