import { useState, FormEvent } from 'react';
import { useNavigate } from '@remix-run/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Please enter both email and password');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userId', data.user.id);

        setMessage('Login successful!');
        navigate(`/profile/${data.user.id}`);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
