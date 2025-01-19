import React, { useState, FormEvent } from 'react';
import { useLoaderData, redirect, json, Form, useActionData } from '@remix-run/react';
import { LoaderFunction, ActionFunction } from '@remix-run/node';
import connectToDatabase from '~/utils/db';
import UserProfileModel from '~/models/UserProfileModel'; 
import { authenticateToken } from '~/middleware/Middleware';

interface UserData {
  name: string;
  email: string;
  location: string;
}

interface LoaderData {
  userData: UserData;
  message?: string;
}

interface ActionData {
  message?: string;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await connectToDatabase();

  const token = request.headers.get('Authorization')?.split(' ')[1];
  const userId = params.userId;

  if (!token || !userId) {
    return redirect('/login');
  }

  try {
    const userPayload = await authenticateToken(token); // Verify token and get user details
    if (!userPayload) {
      return redirect('/login');
    }

    const user = await UserProfileModel.findById(userId);
    if (!user) {
      return json({ message: 'User not found' }, { status: 404 });
    }

    return json({ userData: { name: user.name, email: user.email, location: user.location } });
  } catch (error) {
    console.error('Error in loader:', error);
    return json({ message: 'An error occurred while fetching the profile.' }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  await connectToDatabase();

  const formData = await request.formData();
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const userId = params.userId;

  if (!token || !userId) {
    return redirect('/login');
  }

  try {
    const userPayload = await authenticateToken(token); 
    if (!userPayload) {
      return redirect('/login');
    }

    const userData = {
      name: formData.get('name')?.toString(),
      email: formData.get('email')?.toString(),
      location: formData.get('location')?.toString(),
    };

    const user = await UserProfileModel.findByIdAndUpdate(userId, userData, { new: true });
    if (!user) {
      return json({ message: 'User not found or update failed' }, { status: 404 });
    }

    return json({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('Error in action:', error);
    return json({ message: 'An error occurred while updating the profile.' }, { status: 500 });
  }
};

const UserProfile: React.FC = () => {
  const { userData, message: initialMessage } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const [userDataState, setUserDataState] = useState<UserData>(userData);
  const [message, setMessage] = useState<string>(initialMessage || '');
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdate = async (e: FormEvent) => {
    setLoading(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>User Profile</h2>
        {loading && <p style={styles.loading}>Loading...</p>}
        <Form method="post" onSubmit={handleUpdate}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              value={userDataState.name}
              onChange={(e) => setUserDataState({ ...userDataState, name: e.target.value })}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={userDataState.email}
              onChange={(e) => setUserDataState({ ...userDataState, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input
              style={styles.input}
              type="text"
              name="location"
              value={userDataState.location}
              onChange={(e) => setUserDataState({ ...userDataState, location: e.target.value })}
              required
            />
          </div>
          <button
            style={{
              ...styles.button,
              backgroundColor: loading ? '#ccc' : '#007bff',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </Form>
        {message && (
          <p
            style={{
              ...styles.message,
              color: message.includes('successfully') ? 'green' : 'red',
            }}
          >
            {message || actionData?.message}
          </p>
        )}
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
  loading: {
    textAlign: 'center',
    color: '#555',
    marginBottom: '15px',
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
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
  },
  message: {
    textAlign: 'center',
    marginTop: '10px',
  },
};

export default UserProfile;
