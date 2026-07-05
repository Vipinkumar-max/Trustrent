const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getListings,
  getListing,
  createListing,
  getMyListings,
  updateListing,
  deleteListing
} = require('../controllers/listingController');

router.get('/', getListings);
router.get('/my/listings', protect, getMyListings);
router.get('/:id', getListing);

router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;