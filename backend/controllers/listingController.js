const Listing = require('../models/Listing');

const getListings = async (req, res) => {
  try {
    const { city, type, minRent, maxRent } = req.query;

    let query = { available: true };

    if (city) {
      query.city = new RegExp(city, 'i');
    }

    if (type) {
      query.type = type;
    }

    if (minRent || maxRent) {
      query.rent = {};

      if (minRent) {
        query.rent.$gte = Number(minRent);
      }

      if (maxRent) {
        query.rent.$lte = Number(maxRent);
      }
    }

    const listings = await Listing.find(query)
      .populate('landlord', 'name profilePic trustScore')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('landlord', 'name profilePic trustScore phone email');

    if (!listing) {
      return res.status(404).json({
        message: 'Not found'
      });
    }

    listing.views += 1;
    await listing.save();

    res.json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

const createListing = async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({
        message: 'Only landlords can create listings'
      });
    }

    const listing = await Listing.create({
      ...req.body,
      landlord: req.user._id
    });

    res.status(201).json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const getMyListings = async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({
        message: 'Only landlords can view their listings'
      });
    }

    const listings = await Listing.find({
      landlord: req.user._id
    })
      .populate('landlord', 'name profilePic trustScore')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

const updateListing = async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({
        message: 'Only landlords can update listings'
      });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: 'Listing not found'
      });
    }

    if (listing.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized'
      });
    }

    const allowedFields = [
      'title',
      'description',
      'type',
      'address',
      'city',
      'rent',
      'deposit',
      'furnishing',
      'amenities',
      'photos',
      'available'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    await listing.save();

    res.json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

const deleteListing = async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({
        message: 'Only landlords can delete listings'
      });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: 'Listing not found'
      });
    }

    if (listing.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized'
      });
    }

    await listing.deleteOne();

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

module.exports = {
  getListings,
  getListing,
  createListing,
  getMyListings,
  updateListing,
  deleteListing
};