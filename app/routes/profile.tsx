import { LoaderFunction, ActionFunction } from '@remix-run/node';
import connectToDatabase from '~/utils/db';
import User from '~/models/User';
import { authenticateToken } from '~/middleware/Middleware'; 

export const loader: LoaderFunction = async ({ params, request }) => {
  await connectToDatabase();

  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

  try {
    const userPayload = await authenticateToken(token);
    const user = await User.findById(params.id).select('-password');
    if (!user) return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    const error = err as Error;
    return new Response(JSON.stringify({ message: error.message }), { status: 403 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  await connectToDatabase();

  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

  try {
    const updates = await request.json();
    if (updates.password) return new Response(JSON.stringify({ message: 'Password updates are not allowed here' }), { status: 400 });

    const user = await User.findByIdAndUpdate(params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'Profile updated successfully', user }), { status: 200 });
  } catch (err) {
    const error = err as Error;
    return new Response(JSON.stringify({ message: error.message }), { status: 403 });
  }
};
