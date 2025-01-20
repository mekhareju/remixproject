import React, { useState, useEffect } from 'react';
import { useActionData, Form, json } from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';
import { Link, useNavigate } from '@remix-run/react';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import connectToDatabase from '~/utils/db';

const JWT_SECRET = 'your-secret-key';
const JWT_EXPIRES_IN = '1h';

interface ActionData {
  message: string;
  token?: string;
  user?: { _id: string; name: string; email: string };
}

export const action: ActionFunction = async ({ request }) => {
  await connectToDatabase();

  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return json({ message: 'Please enter both email and password' }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return json({ message: 'Invalid email or password' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return json({ message: 'Invalid email or password' }, { status: 400 });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return json({
      message: 'Login successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
};

const Login: React.FC = () => {
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actionData?.token && actionData?.user) {
      console.log("Token and user received", actionData.token, actionData.user);
      localStorage.setItem('userToken', actionData.token);
      localStorage.setItem('userId', actionData.user._id);
      navigate('/profile');
    }
  }, [actionData, navigate]);

 // const handleSubmit = async (e: React.FormEvent) => {
   // e.preventDefault();
    //setLoading(true);
  //};

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Login</h2>
        <Form method="post" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">
              Email
            </label>
            <input
              style={styles.input}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              style={styles.input}
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </Form>
        {actionData?.message && (
          <p style={{ color: actionData.token ? 'green' : 'red', textAlign: 'center', marginTop: '10px' }}>
            {actionData.message}
          </p>
        )}
        <p style={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f3f4f6',
  },
  formBox: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '8px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #ccc',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '20px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Login;