import { useEffect, useState } from 'react';
import { useNavigate } from '@remix-run/react';

interface UserData {
  name: string;
  email: string;
  location: string;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    location: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setMessage('Unauthorized access. Please log in.');
        navigate('/login');
        return;
      }

      setLoading(true);
      setMessage('');

      try {
        const response = await fetch(`/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: UserData = await response.json();
          setUserData(data);
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || 'Failed to fetch profile.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('An error occurred while fetching the profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async () => {
    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      setMessage('Unauthorized access. Please log in.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('An error occurred while updating the profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      {loading && <p>Loading...</p>}
      <form>
        <input
          type="text"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <input
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <input
          type="text"
          value={userData.location}
          onChange={(e) => setUserData({ ...userData, location: e.target.value })}
        />
        <button type="button" onClick={handleUpdate}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserProfile;
