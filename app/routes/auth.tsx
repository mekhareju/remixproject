import { ActionFunction } from '@remix-run/node';
import connectToDatabase from '~/utils/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '~/models/User';

const JWT_SECRET = 'your-secret-key';
const JWT_EXPIRES_IN = '1h';

export const action: ActionFunction = async ({ request }) => {
  await connectToDatabase();

  const formData = await request.formData();
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
  }

  try {
    if (request.method === 'POST' && request.url.includes('/signup')) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new Response(JSON.stringify({ message: 'Email already in use' }), { status: 400 });
      }

      if (password.length < 6) {
        return new Response(JSON.stringify({ message: 'Password must be at least 6 characters long' }), { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      //const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }); 

      return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
    }

    if (request.method === 'POST' && request.url.includes('/login')) {
      const user = await User.findOne({ email });
      if (!user) {
        return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 400 });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 400 });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      return new Response(JSON.stringify({
        message: 'Login successful',
        token,
        user: { id: user._id, name: user.name, email: user.email },
      }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Invalid action' }), { status: 400 });
  } catch (err) {
    const error = err as Error;
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
};
