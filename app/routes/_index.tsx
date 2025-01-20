import React, { useEffect, useState } from 'react';
import { LinksFunction, MetaFunction, LoaderFunction } from '@remix-run/node';
import { Link, Outlet, ScrollRestoration, useLoaderData } from '@remix-run/react';
import connectToDatabase from '../utils/db';
import Product from '../models/Product';

interface Product {
  _id: string;
  title: string;
  imagePath: string;
  price: number;
}

interface LoaderData {
  products: Product[];
}

export const links: LinksFunction = () => {
  return [];
};

export const meta: MetaFunction = () => {
  return [{ title: 'My Gift Shop' }];
};

export const loader: LoaderFunction = async () => {
  await connectToDatabase();
  const products = await Product.find().lean();
  return { products };
};

export default function Index() {
  const { products } = useLoaderData<LoaderData>();
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; 
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to My Gift Shop!</h1>
      <p style={styles.subheading}>Your one-stop shop for unique gifts!</p>
      <div style={styles.imageContainer}>
      {products.map((product) => (
          <div key={product._id} style={styles.productCard}>
            <img
              src={product.imagePath} 
              alt={product.title}
              style={styles.image}
            />
            <h3>{product.title}</h3>
            <p>RS {product.price}</p>
          </div>
        ))}
      </div>
      <Outlet />
      <ScrollRestoration />
    </div>
  );
}

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