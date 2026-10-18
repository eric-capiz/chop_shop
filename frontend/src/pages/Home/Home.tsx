import Hero from "@/components/Hero/Hero";
import ServicesSection from "@/components/ServicesSection/ServicesSection";
import ArtistsSection from "@/components/ArtistsSection/ArtistsSection";
import GalleryStrip from "@/components/GalleryStrip/GalleryStrip";
import BookCta from "@/components/BookCta/BookCta";
import "./_home.scss";

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <ServicesSection />
      <ArtistsSection />
      <GalleryStrip />
      <BookCta />
    </div>
  );
};

export default Home;
