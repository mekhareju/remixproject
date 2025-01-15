import styles from "~/styles/Footer.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>© 2024 Gift Shop. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
