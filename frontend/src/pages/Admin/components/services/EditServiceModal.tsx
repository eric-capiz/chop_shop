import { useState } from "react";
import { useUpdateService } from "@hooks/admin/useService";
import { Service } from "@/types/admin/services.types";
import { FaTimes } from "react-icons/fa";
import "./_serviceModals.scss";

interface EditServiceModalProps {
  service: Service;
  onClose: () => void;
}

const EditServiceModal = ({ service, onClose }: EditServiceModalProps) => {
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(service.description);
  const [duration, setDuration] = useState(String(service.duration));
  const [price, setPrice] = useState(String(service.price));
  const [category, setCategory] = useState(service.category);

  const updateService = useUpdateService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateService.mutateAsync({
        id: service._id,
        serviceData: {
          name,
          description,
          duration: Number(duration),
          price: Number(price),
          category,
        },
      });
      onClose();
    } catch (error) {
      console.error("Failed to update service:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Service</h3>
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
              <option value="haircut">Haircut</option>
              <option value="facial-hair">Facial Hair</option>
              <option value="eyebrows">Eyebrows</option>
              <option value="combo">Combo</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-save"
              disabled={updateService.isPending}
            >
              {updateService.isPending ? "Updating..." : "Update Service"}
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

export default EditServiceModal;
