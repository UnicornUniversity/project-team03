// tohle je middleware pro ověření API klíče, ochranuje posty, dame ho do složky middleware
module.exports = function (req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }
    next();
  };  
// tady je např. upravený kousek kodu z routes/sensors.js
// const authApiKey = require('../middleware/authApiKey');
// router.post('/mongo-upload', authApiKey, async (req, res) => {
//   ...
// });
  