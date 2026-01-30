import { useDeleteService } from "@hooks/admin/useService";
import { Service } from "@/types/admin/services.types";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import "./_serviceModals.scss";

interface DeleteServiceModalProps {
  service: Service;
  onClose: () => void;
}

const DeleteServiceModal = ({ service, onClose }: DeleteServiceModalProps) => {
  const deleteService = useDeleteService();

  const handleDelete = async () => {
    try {
      await deleteService.mutateAsync(service._id);
      onClose();
    } catch (error: any) {
      console.error(
        "Failed to delete service:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <div className="modal-header">
          <h3>Delete Service</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div className="warning-icon">
            <FaExclamationTriangle />
          </div>
          <p>
            Are you sure you want to delete <strong>{service.name}</strong>?
          </p>
          <p className="warning-text">This action cannot be undone.</p>
        </div>

        <div className="modal-actions">
          <button
            className="btn-delete"
            onClick={handleDelete}
            disabled={deleteService.isPending}
          >
            {deleteService.isPending ? "Deleting..." : "Delete"}
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteServiceModal;
