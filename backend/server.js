const express = require('express');
const dotenv  = require('dotenv');
const cors    = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/rentals',  require('./routes/rentalRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'TrustRent API is running ✅' });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);