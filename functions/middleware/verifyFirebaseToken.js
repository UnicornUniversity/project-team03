// tohle je middleware pro ověření ID tokenu z Firebase, ochranuje gety
const admin = require('firebase-admin');

if (!process.env.SERVICE_ACC) {
  throw new Error('Missing SVC_ACC_JSON environment variable!');
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.SERVICE_ACC);
} catch (err) {
  console.error('Failed to parse service account JSON from SVC_ACC_JSON:', err.message);
  process.exit(1);
}

const svcAcc = process.env.SERVICE_ACC;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Invalid Firebase token', err);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
