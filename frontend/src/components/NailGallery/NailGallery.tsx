import { useState, useEffect, useMemo } from "react";
import { useTechniciansList } from "@/hooks/useTechnicians";
import { useTechnicianGallery } from "@/hooks/useTechnicians";
import "./_nailGallery.scss";

const NailGallery = () => {
  const { data: technicians } = useTechniciansList();
  const firstBarberId = technicians?.[0]?._id;
  const { data: technicianGallery } = useTechnicianGallery(firstBarberId, !!firstBarberId);

  const images = useMemo(() => technicianGallery ?? [], [technicianGallery]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setRotation((prev) => prev + 360);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 750);
    }, 4500);

    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;

  return (
    <div className="nail-gallery">
      <div
        className="gallery-card"
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        <div className="card-face front">
          <img src={images[currentIndex].image.url} alt="Nail design" />
        </div>
        <div className="card-face back">
          <img src={images[nextIndex].image.url} alt="Nail design" />
        </div>
      </div>
    </div>
  );
};

export default NailGallery;
