const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createRental,
  getMyRentals,
  getLandlordRentals,
  updateRentalStatus
} = require('../controllers/rentalController');

router.post('/',              protect, createRental);
router.get('/my',             protect, getMyRentals);
router.get('/landlord',       protect, getLandlordRentals);
router.put('/:id/status',     protect, updateRentalStatus);

module.exports = router;