import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Gift Shop | Home" },
    { name: "description", content: "Explore our collection of unique gifts!" },
  ];
};

export default function Index() {
  const images = [
    '/images/img.png',
    '/images/img2.png',
    '/images/img3.png',
  ];

  return (
    <div style={styles.container as React.CSSProperties}>
      <h1 style={styles.heading as React.CSSProperties}>Welcome to My Gift Shop</h1>
      <p style={styles.subheading as React.CSSProperties}>Your one-stop shop for unique gifts!</p>
      <div style={styles.imageContainer as React.CSSProperties}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Gift ${index + 1}`}
            style={styles.image as React.CSSProperties}
          />
        ))}
      </div>
      <Link to="/about" style={styles.link as React.CSSProperties}>Learn More About Us</Link>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f9fafb",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  subheading: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#555",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  image: {
    maxWidth: "300px",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  link: {
    marginTop: "20px",
    display: "inline-block",
    textDecoration: "none",
    color: "#007BFF",
    fontWeight: "bold",
  },
};
