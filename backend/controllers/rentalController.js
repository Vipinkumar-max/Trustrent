const Rental = require('../models/Rental');
const Listing = require('../models/Listing');

// Tenant creates rental request
const createRental = async (req, res) => {
  const { listingId, startDate, endDate } = req.body;

  try {
    if (req.user.role !== 'tenant') {
      return res.status(403).json({
        message: 'Only tenants can request rentals'
      });
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        message: 'Listing not found'
      });
    }

    if (listing.landlord.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: 'You cannot request your own listing'
      });
    }

    const existingRental = await Rental.findOne({
      listing: listingId,
      tenant: req.user._id,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingRental) {
      return res.status(400).json({
        message: 'Rental request already exists'
      });
    }

    const platformFee = Math.round(listing.rent * 0.02);

    const rental = await Rental.create({
      listing: listingId,
      tenant: req.user._id,
      landlord: listing.landlord,
      rent: listing.rent,
      deposit: listing.deposit || 0,
      platformFee,
      startDate,
      endDate,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      rental
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Tenant sees own rentals
const getMyRentals = async (req, res) => {
  try {
    if (req.user.role !== 'tenant') {
      return res.status(403).json({
        message: 'Only tenants can view rentals'
      });
    }

    const rentals = await Rental.find({
      tenant: req.user._id
    })
      .populate('listing', 'title address city rent photos')
      .populate('landlord', 'name phone trustScore')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      rentals
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Landlord sees rental requests on own listings
const getLandlordRentals = async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({
        message: 'Only landlords can view requests'
      });
    }

    const rentals = await Rental.find({
      landlord: req.user._id
    })
      .populate('listing', 'title address city rent')
      .populate('tenant', 'name phone trustScore')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      rentals
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Landlord approves/rejects rental request
const updateRentalStatus = async (req, res) => {
  const { status } = req.body;

  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({
        message: 'Only landlords can update requests'
      });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status'
      });
    }

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        message: 'Rental not found'
      });
    }

    if (rental.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized'
      });
    }

    rental.status = status;
    await rental.save();

    res.json({
      success: true,
      rental
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

module.exports = {
  createRental,
  getMyRentals,
  getLandlordRentals,
  updateRentalStatus
};