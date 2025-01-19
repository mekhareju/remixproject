import React from 'react';
import { LinksFunction, MetaFunction, LoaderFunction } from '@remix-run/node';
import { Link, Outlet, ScrollRestoration, useLoaderData } from '@remix-run/react';
import connectToDatabase from '../utils/db';
import User from '../models/User';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  location?: string;
}

interface LoaderData {
  users: User[];
}

export const links: LinksFunction = () => {
  return [];
};

export const meta: MetaFunction = () => {
  return [{ title: 'My Gift Shop' }];
};

export const loader: LoaderFunction = async () => {
  await connectToDatabase();
  const users = await User.find().lean();
  return { users };
};

export default function Index() {
  const { users } = useLoaderData<LoaderData>();
  
  const images = [
    '/images/img.png',
    '/images/img2.png',
    '/images/img3.png',
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to My Gift Shop!</h1>
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