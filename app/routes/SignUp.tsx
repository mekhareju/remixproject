import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import { Form, useActionData, json } from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';

interface ActionData {
  message: string;
  token?: string;
  user?: { id: string };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ message: 'Please fill in all fields' }), { status: 400 });
  }

  try {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data: ActionData = await response.json();
    if (response.ok) {
      return new Response(JSON.stringify({ message: 'User registered successfully!', token: data.token, user: data.user }), { status: 201 });
    } else {
      return new Response(JSON.stringify({ message: data.message || 'Signup failed.' }), { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: 'Something went wrong. Please try again.' }), { status: 500 });
  }
};

const SignUp: React.FC = () => {
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (actionData?.token && actionData?.user?.id) {
      localStorage.setItem('userToken', actionData.token);
      localStorage.setItem('userId', actionData.user.id);
      navigate('/login');
    }
  }, [actionData, navigate]);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: new FormData(e.currentTarget as HTMLFormElement),
    });
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Sign Up</h2>
        <Form method="post" onSubmit={handleSignUp} style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">
              Name
            </label>
            <input
              style={styles.input}
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              required
            />
          </div>
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
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </Form>
        {actionData?.message && <p style={styles.message}>{actionData.message}</p>}
        <p style={styles.switchText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
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
  message: {
    textAlign: 'center',
    color: 'red',
    marginTop: '10px',
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

export default SignUp;
