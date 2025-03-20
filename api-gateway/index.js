const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('API Gateway');
});

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});