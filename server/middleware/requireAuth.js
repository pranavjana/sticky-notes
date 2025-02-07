import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const requireAuth = ClerkExpressRequireAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
  onError: (err, req, res) => {
    console.error('Clerk Auth Error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default requireAuth; 