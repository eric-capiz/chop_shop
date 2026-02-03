import { useState, useEffect, useMemo } from "react";
import { useBarbersList } from "@/hooks/useBarbers";
import { useBarberGallery } from "@/hooks/useBarbers";
import "./_haircutGallery.scss";

const HaircutGallery = () => {
  const { data: barbers } = useBarbersList();
  const firstBarberId = barbers?.[0]?._id;
  const { data: barberGallery } = useBarberGallery(firstBarberId, !!firstBarberId);

  const images = useMemo(() => barberGallery ?? [], [barberGallery]);

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
    <div className="haircut-gallery">
      <div
        className="gallery-card"
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        <div className="card-face front">
          <img src={images[currentIndex].image.url} alt="Haircut style" />
        </div>
        <div className="card-face back">
          <img src={images[nextIndex].image.url} alt="Haircut style" />
        </div>
      </div>
    </div>
  );
};

export default HaircutGallery;
