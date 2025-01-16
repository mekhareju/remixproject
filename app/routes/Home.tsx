import React from 'react';

const Home: React.FC = () => {
  const images = ['/images/img.png', '/images/img2.png', '/images/img3.png'];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to My Gift Shop</h1>
      <p style={styles.subheading}>Your one-stop shop for unique gifts!</p>
      <div style={styles.imageContainer}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Gift ${index + 1}`}
            style={styles.image}
          />
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f9fafb',
  },
  heading: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  subheading: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#555',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  image: {
    maxWidth: '300px',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default Home;