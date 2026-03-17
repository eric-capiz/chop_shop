import {
  FaMapMarkerAlt,
  FaPhone,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";
import "./_footer.scss";

const ADDRESS = "123 N Fake Rd, El Paso, TX 79936";
const PHONE = "(915) 555-5555";
const PHONE_RAW = "9155555555";

const SOCIAL = [
  { label: "Facebook", href: "https://facebook.com", Icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", Icon: FaInstagram },
  { label: "TikTok", href: "https://tiktok.com", Icon: FaTiktok },
  { label: "Twitter", href: "https://twitter.com", Icon: FaTwitter },
] as const;

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-block footer-address">
            <FaMapMarkerAlt className="footer-icon" aria-hidden />
            <div>
              <span className="footer-label">Visit us</span>
              <address className="footer-value">{ADDRESS}</address>
            </div>
          </div>
          <div className="footer-block footer-credit-block">
            <span className="footer-credit">
              Developed by{" "}
              <a
                href="https://www.ericcapiz.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Eric Capiz
              </a>{" "}
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="footer-block footer-phone">
            <FaPhone className="footer-icon" aria-hidden />
            <div>
              <span className="footer-label">Barber Shop</span>
              <a
                href={`tel:+1${PHONE_RAW}`}
                className="footer-value footer-link"
              >
                {PHONE}
              </a>
            </div>
          </div>
        </div>
        <div className="footer-social">
          <span className="footer-social-label">Barber Shop</span>
          <div className="footer-social-links">
            {SOCIAL.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={`Chop Shop on ${label}`}
              >
                <Icon aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
