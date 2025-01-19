import React, { useState, useEffect } from 'react';
import { useActionData, Form, json } from '@remix-run/react';
import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Link, useNavigate} from '@remix-run/react';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import connectToDatabase from '~/utils/db';

const JWT_SECRET = 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';

interface ActionData {
  message: string;
  token?: string;
  user?: { _id: string; name: string; email: string };
}

export const loader: LoaderFunction = async () => {
  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
      return json({ message: 'Please enter both email and password' }, { status: 400 });
    }

    const user = await User.findOne({ email }).lean();
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
  };

    if (actionData?.token && actionData?.user) {
      try {
        localStorage.setItem("userToken", actionData.token);
        localStorage.setItem("userId", actionData.user._id);

        navigate(`/profile/${actionData.user._id}`);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }


  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login</h2>
      <Form method="post" style={{ maxWidth: '400px', margin: '0 auto' }} onSubmit={handleSubmit}>
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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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