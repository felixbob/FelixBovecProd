const express = require('express');
const app = express();
app.use(express.json());
app.post('/', (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});
app.listen(3001, () => console.log('Listening on 3001'));
