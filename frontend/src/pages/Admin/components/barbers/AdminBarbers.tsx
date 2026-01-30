import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import {
  useBarbers,
  useCreateBarber,
  useTransferSuperAdmin,
  useDeleteBarber,
} from "@/hooks/admin/useBarbers";
import type { AdminBarber } from "@/services/admin/barbers.service";
import { useAuthStore } from "@/store/authStore";
import "./_adminBarbers.scss";

const AddBarberModal = ({
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
  const createBarber = useCreateBarber();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createBarber.mutateAsync({ username, password, name, email });
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
        className="modal-content admin-barbers-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Add Barber</h3>
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
              <label htmlFor="barber-username">Username</label>
              <input
                id="barber-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="barber-password">Password (min 6 characters)</label>
              <input
                id="barber-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label htmlFor="barber-name">Name</label>
              <input
                id="barber-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="barber-email">Email</label>
              <input
                id="barber-email"
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
              disabled={createBarber.isPending}
            >
              {createBarber.isPending ? "Adding..." : "Add Barber"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteBarberModal = ({
  barber,
  onClose,
  onSuccess,
}: {
  barber: AdminBarber;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const deleteBarber = useDeleteBarber();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteBarber.mutateAsync(barber._id);
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
        className="modal-content delete-barber-modal admin-barbers-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Delete Barber</h3>
          <button type="button" className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <div className="warning-icon" style={{ color: "#ff6666", marginBottom: "0.5rem" }}>
            <FaExclamationTriangle size={24} />
          </div>
          <p>
            Are you sure you want to delete <strong>{barber.name}</strong> (
            {barber.username})?
          </p>
          <p className="warning-text">
            This will remove the barber and all their data (profile, services,
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
            disabled={deleteBarber.isPending}
          >
            {deleteBarber.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminBarbers = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const currentUserId = (user as { _id?: string })?._id;
  const { data: barbers, isLoading } = useBarbers();
  const transferSuperAdmin = useTransferSuperAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [barberToDelete, setBarberToDelete] = useState<AdminBarber | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);

  const handleTransfer = async (barberId: string) => {
    setTransferError(null);
    try {
      await transferSuperAdmin.mutateAsync(barberId);
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
    }
  };

  if (isLoading) return <div className="admin-barbers">Loading...</div>;
  if (!barbers) return <div className="admin-barbers">No barbers found.</div>;

  return (
    <div className="admin-barbers">
      <div className="admin-barbers__header">
        <h2>Manage Barbers</h2>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Add Barber
        </button>
      </div>

      {transferError && (
        <p style={{ color: "#ff4444", marginBottom: "1rem" }}>{transferError}</p>
      )}

      <div className="admin-barbers__content">
        {barbers.map((barber) => {
          const isSelf = barber._id === currentUserId;
          return (
            <div key={barber._id} className="admin-barbers__card">
              <div className="barber-header">
                <h3>{barber.name}</h3>
                <span className="role-badge">{barber.role}</span>
              </div>
              <div className="barber-details">
                <p>@{barber.username}</p>
                <p>{barber.email}</p>
              </div>
              {!isSelf && (
                <div className="barber-actions">
                  {barber.role === "admin" && (
                    <button
                      type="button"
                      className="btn-transfer"
                      disabled={transferSuperAdmin.isPending}
                      onClick={() => handleTransfer(barber._id)}
                    >
                      {transferSuperAdmin.isPending ? "Transferring..." : "Make super admin"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-delete"
                    disabled={transferSuperAdmin.isPending}
                    onClick={() => setBarberToDelete(barber)}
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
        <AddBarberModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => setShowAddModal(false)}
        />
      )}
      {barberToDelete && (
        <DeleteBarberModal
          barber={barberToDelete}
          onClose={() => setBarberToDelete(null)}
          onSuccess={() => setBarberToDelete(null)}
        />
      )}
    </div>
  );
};

export default AdminBarbers;
