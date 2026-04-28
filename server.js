const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'flurr.html'));
});

app.listen(PORT, () => {
  console.log(`Flurr server running at http://localhost:${PORT}`);
});
