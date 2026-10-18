import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTimes, FaExclamationTriangle, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  useTechnicians,
  useCreateTechnician,
  useTransferSuperAdmin,
  useDeleteTechnician,
} from "@/hooks/admin/useTechnicians";
import type { AdminTechnician } from "@/services/admin/technicians.service";
import { useAuthStore } from "@/store/authStore";
import "./_adminTechnicians.scss";

const AddTechnicianModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const createTechnician = useCreateTechnician();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createTechnician.mutateAsync({ username, password, name, email });
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message;
      setError(msg);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content admin-technicians-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Add Technician</h3>
          <button type="button" className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <p style={{ color: "#ff4444", marginBottom: "1rem" }}>{error}</p>
            )}
            <div className="form-group">
              <label htmlFor="technician-username">Username</label>
              <input
                id="technician-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="technician-password">Password (min 6 characters)</label>
              <div className="password-input-wrap">
                <input
                  id="technician-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="technician-name">Name</label>
              <input
                id="technician-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="technician-email">Email</label>
              <input
                id="technician-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={createTechnician.isPending}
            >
              {createTechnician.isPending ? "Adding..." : "Add Technician"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteTechnicianModal = ({
  technician,
  onClose,
  onSuccess,
}: {
  technician: AdminTechnician;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const deleteTechnician = useDeleteTechnician();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteTechnician.mutateAsync(technician._id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to delete"
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content delete-technician-modal admin-technicians-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Delete Technician</h3>
          <button type="button" className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <div className="warning-icon" style={{ color: "#ff6666", marginBottom: "0.5rem" }}>
            <FaExclamationTriangle size={24} />
          </div>
          <p>
            Are you sure you want to delete <strong>{technician.name}</strong> (
            {technician.username})?
          </p>
          <p className="warning-text">
            This will remove the technician and all their data (profile, services,
            gallery, availability, appointments, reviews). This cannot be undone.
          </p>
          {error && (
            <p style={{ color: "#ff4444", marginTop: "0.5rem" }}>{error}</p>
          )}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-save"
            style={{ background: "#cc3333" }}
            onClick={handleDelete}
            disabled={deleteTechnician.isPending}
          >
            {deleteTechnician.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TransferConfirmModal = ({
  technician,
  onClose,
  onConfirm,
  isPending,
}: {
  technician: AdminTechnician;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) => (
  <div className="modal-overlay" onClick={onClose}>
    <div
      className="modal-content delete-technician-modal admin-technicians-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h3>Transfer super admin role</h3>
        <button type="button" className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="modal-body">
        <p>
          Transfer the super admin role to <strong>{technician.name}</strong> (
          {technician.username})?
        </p>
        <p className="warning-text">
          You will be logged out and <strong>{technician.name}</strong> will become
          the only super admin. You can only regain super admin if they transfer
          it back to you.
        </p>
      </div>
      <div className="modal-actions">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="btn-save"
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? "Transferring..." : "Yes, transfer and log me out"}
        </button>
      </div>
    </div>
  </div>
);

const AdminTechnicians = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const currentUserId = (user as { _id?: string })?._id;
  const { data: technicians, isLoading } = useTechnicians();
  const transferSuperAdmin = useTransferSuperAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [technicianToDelete, setTechnicianToDelete] = useState<AdminTechnician | null>(null);
  const [technicianToTransfer, setTechnicianToTransfer] = useState<AdminTechnician | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);

  const handleTransfer = async (technicianId: string) => {
    setTransferError(null);
    try {
      await transferSuperAdmin.mutateAsync(technicianId);
      useAuthStore.getState().clearAuth();
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminExpiry");
      navigate("/", { replace: true });
      window.location.reload(); // Force re-login
    } catch (err: any) {
      setTransferError(
        err.response?.data?.message || err.message || "Transfer failed"
      );
      setTechnicianToTransfer(null);
    }
  };

  const handleConfirmTransfer = () => {
    if (!technicianToTransfer) return;
    const id = technicianToTransfer._id;
    setTechnicianToTransfer(null);
    handleTransfer(id);
  };

  if (isLoading) return <div className="admin-technicians">Loading...</div>;
  if (!technicians) return <div className="admin-technicians">No technicians found.</div>;

  return (
    <div className="admin-technicians">
      <div className="admin-technicians__header">
        <h2>Manage Technicians</h2>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Add Technician
        </button>
      </div>

      {transferError && (
        <p style={{ color: "#ff4444", marginBottom: "1rem" }}>{transferError}</p>
      )}

      <div className="admin-technicians__content">
        {technicians.map((technician) => {
          const isSelf = technician._id === currentUserId;
          return (
            <div key={technician._id} className="admin-technicians__card">
              <div className="technician-header">
                <h3>{technician.name}</h3>
                <span className="role-badge">{technician.role}</span>
              </div>
              <div className="technician-details">
                <p>@{technician.username}</p>
                <p>{technician.email}</p>
              </div>
              {!isSelf && (
                <div className="technician-actions">
                  {technician.role === "admin" && (
                    <button
                      type="button"
                      className="btn-transfer"
                      disabled={transferSuperAdmin.isPending}
                      onClick={() => setTechnicianToTransfer(technician)}
                    >
                      {transferSuperAdmin.isPending ? "Transferring..." : "Make super admin"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-delete"
                    disabled={transferSuperAdmin.isPending}
                    onClick={() => setTechnicianToDelete(technician)}
                  >
                    Delete
                  </button>
                </div>
              )}
              {isSelf && (
                <p style={{ color: "var(--silver-dark)", fontSize: "0.85rem" }}>
                  (You)
                </p>
              )}
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <AddTechnicianModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => setShowAddModal(false)}
        />
      )}
      {technicianToDelete && (
        <DeleteTechnicianModal
          technician={technicianToDelete}
          onClose={() => setTechnicianToDelete(null)}
          onSuccess={() => setTechnicianToDelete(null)}
        />
      )}
      {technicianToTransfer && (
        <TransferConfirmModal
          technician={technicianToTransfer}
          onClose={() => setTechnicianToTransfer(null)}
          onConfirm={handleConfirmTransfer}
          isPending={transferSuperAdmin.isPending}
        />
      )}
    </div>
  );
};

export default AdminTechnicians;
