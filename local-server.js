const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const formRoutes = require('./routes/formRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', formRoutes);
app.use(express.static(path.join(__dirname)));

app.listen(port, () => {
  console.log(`Giant Minds backend running on http://localhost:${port}`);
});
