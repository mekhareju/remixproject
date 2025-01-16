import React, { useState } from 'react';
import { useActionData, Form, json } from '@remix-run/react';
import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

interface ActionData {
  message: string;
  token?: string;
  user?: { id: string };
}

export const loader: LoaderFunction = async () => {
  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'Please enter both email and password' }), { status: 400 });
  }

  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data: ActionData = await response.json();
      return json({ message: 'Login successful!', token: data.token, user: data.user });
    } else {
      const errorData: ActionData = await response.json();
      return new Response(JSON.stringify({ message: errorData.message || 'Invalid email or password' }), { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: 'Something went wrong. Please try again.' }), { status: 500 });
  }
};

const Login: React.FC = () => {
  const actionData = useActionData<ActionData>();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (actionData?.token && actionData?.user?.id) {
      localStorage.setItem('userToken', actionData.token);
      localStorage.setItem('userId', actionData.user.id);
      window.location.href = `/profile/${actionData.user.id}`;
    }
  }, [actionData]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login</h2>
      <Form method="post" style={{ maxWidth: '400px', margin: '0 auto' }} onSubmit={() => setLoading(true)}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            backgroundColor: loading ? '#ccc' : '#007BFF',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </Form>
      <p>
        No account yet? <Link to="/signup">Sign up</Link>
      </p>
      {actionData?.message && (
        <p style={{ marginTop: '15px', color: actionData.message.includes('successful') ? 'green' : 'red' }}>
          {actionData.message}
        </p>
      )}
    </div>
  );
};

export default Login;
