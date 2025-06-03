// tohle je middleware pro ověření API klíče, ochranuje posty
module.exports = function (req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }
    next();
  };  
  