const app = require('../api/server');

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Nawed Dev backend running on port ${port}`);
});
