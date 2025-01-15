export default function About() {
  return (
    <div style={styles.container as React.CSSProperties}>
      <h1>About Us</h1>
      <p>
        We are passionate about creating unique and thoughtful gifts for all
        occasions. Explore our collection and find the perfect gift today!
      </p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
};
