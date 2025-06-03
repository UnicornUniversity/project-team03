// tohle je middleware pro ověření ID tokenu z Firebase, ochranuje gety
const admin = require('firebase-admin');
const serviceAccount = require('../ibotaniq-firebase-adminsdk-fbsvc-5c61389b66.json'); 

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

  