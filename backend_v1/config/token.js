import jwt from 'jsonwebtoken';

const genToken = (userId) => {
  // We can fetch the user's role here to add to the token
  // for now, just the ID is fine, as in your Ranbhoomi code.
  
  return jwt.sign(
    { userId }, // This is the payload
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_LIFETIME || '7d' // Use env or default
    }
  );
};

export default genToken;