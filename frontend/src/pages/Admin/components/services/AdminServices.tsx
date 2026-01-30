import { useState } from "react";
import { useServices } from "@hooks/admin/useService";
import { Service } from "@/types/admin/services.types";
import { FaEdit, FaTrash, FaPlus, FaClock, FaTag } from "react-icons/fa";
import AddServiceModal from "./AddServiceModal";
import EditServiceModal from "./EditServiceModal";
import DeleteServiceModal from "./DeleteServiceModal";
import "./_adminServices.scss";

type ModalType = "add" | "edit" | "delete" | null;

const AdminServices = () => {
  const { data: services, isLoading } = useServices();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setModalType("edit");
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setModalType("delete");
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedService(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!services) return <div>No services found</div>;

  return (
    <div className="admin-services">
      <div className="admin-services__header">
        <h2>Services Management</h2>
        <button className="btn-primary" onClick={() => setModalType("add")}>
          <FaPlus /> Add New Service
        </button>
      </div>

      <div className="admin-services__content">
        {services.map((service: Service) => (
          <div key={service._id} className="admin-services__card">
            <div className="service-header">
              <h3>{service.name}</h3>
              <span className="price">${service.price}</span>
            </div>
            <div className="service-details">
              <p className="description">{service.description}</p>
              <div className="meta">
                <span className="duration">
                  <FaClock /> {service.duration} mins
                </span>
                <span className="category">
                  <FaTag /> {service.category}
                </span>
              </div>
            </div>
            <div className="service-actions">
              <button className="edit-btn" onClick={() => handleEdit(service)}>
                <FaEdit />
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(service)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalType === "add" && <AddServiceModal onClose={handleCloseModal} />}
      {modalType === "edit" && selectedService && (
        <EditServiceModal
          service={selectedService}
          onClose={handleCloseModal}
        />
      )}
      {modalType === "delete" && selectedService && (
        <DeleteServiceModal
          service={selectedService}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminServices;
