const express = require('express');
const router = express.Router();
const Partnership = require('../models/Partnership');
const User = require('../models/User');
const Cause = require('../models/Cause');

// POST /api/partnerships - Create a new collaboration request
router.post('/', async (req, res) => {
  try {
    const { organisationId, ngoId, causeId, volunteersOffered, message, proposedDate } = req.body;

    if (!organisationId || !ngoId || !causeId || !message) {
      return res.status(400).json({ 
        error: 'organisationId, ngoId, causeId, and message are required' 
      });
    }

    // Verify the organization exists
    const organisation = await User.findById(organisationId);
    if (!organisation || organisation.role !== 'organisation') {
      return res.status(404).json({ error: 'Organisation not found' });
    }

    // Verify the NGO exists
    const ngo = await User.findById(ngoId);
    if (!ngo || ngo.role !== 'ngo') {
      return res.status(404).json({ error: 'NGO not found' });
    }

    // Verify the cause exists
    const cause = await Cause.findById(causeId);
    if (!cause) {
      return res.status(404).json({ error: 'Cause not found' });
    }

    // Check if a partnership request already exists
    const existingPartnership = await Partnership.findOne({
      organisationId,
      causeId,
      status: { $in: ['pending', 'approved', 'in-discussion'] }
    });

    if (existingPartnership) {
      return res.status(400).json({ 
        error: 'You already have an active collaboration request for this cause' 
      });
    }

    // Create the partnership request
    const partnership = new Partnership({
      organisationId,
      ngoId,
      causeId,
      volunteersOffered: volunteersOffered || 0,
      message,
      proposedDate: proposedDate || '',
      status: 'pending'
    });

    await partnership.save();

    console.log(`✅ Partnership request created: ${organisation.name} → ${ngo.name} for cause "${cause.name}"`);

    // Populate the response
    const populatedPartnership = await Partnership.findById(partnership._id)
      .populate('organisationId', 'name email city')
      .populate('ngoId', 'name email city')
      .populate('causeId', 'name title category city');

    res.status(201).json({
      message: 'Collaboration request sent successfully',
      partnership: populatedPartnership
    });
  } catch (error) {
    console.error('❌ Create partnership error:', error);
    res.status(500).json({ error: 'Failed to create collaboration request' });
  }
});

// GET /api/partnerships - Get all partnerships (filtered by query params)
router.get('/', async (req, res) => {
  try {
    const { organisationId, ngoId, status } = req.query;

    let query = {};
    if (organisationId) query.organisationId = organisationId;
    if (ngoId) query.ngoId = ngoId;
    if (status) query.status = status;

    const partnerships = await Partnership.find(query)
      .populate('organisationId', 'name email city officeAddress')
      .populate('ngoId', 'name email city')
      .populate('causeId', 'name title category city description volunteersNeeded volunteersJoined')
      .sort({ createdAt: -1 });

    console.log(`📊 Partnerships fetched: ${partnerships.length} (OrgId=${organisationId || 'all'}, NgoId=${ngoId || 'all'}, Status=${status || 'all'})`);

    res.json({ partnerships });
  } catch (error) {
    console.error('❌ Fetch partnerships error:', error);
    res.status(500).json({ error: 'Failed to fetch partnerships' });
  }
});

// GET /api/partnerships/:id - Get a specific partnership
router.get('/:id', async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id)
      .populate('organisationId', 'name email city officeAddress')
      .populate('ngoId', 'name email city')
      .populate('causeId', 'name title category city description volunteersNeeded volunteersJoined');

    if (!partnership) {
      return res.status(404).json({ error: 'Partnership not found' });
    }

    res.json({ partnership });
  } catch (error) {
    console.error('❌ Get partnership error:', error);
    res.status(500).json({ error: 'Failed to fetch partnership' });
  }
});

// PATCH /api/partnerships/:id - Update partnership status (approve/reject by NGO)
router.patch('/:id', async (req, res) => {
  try {
    const { status, responseMessage } = req.body;

    if (!status || !['approved', 'rejected', 'in-discussion'].includes(status)) {
      return res.status(400).json({ 
        error: 'Valid status is required (approved, rejected, or in-discussion)' 
      });
    }

    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) {
      return res.status(404).json({ error: 'Partnership not found' });
    }

    partnership.status = status;
    if (responseMessage) {
      partnership.responseMessage = responseMessage;
    }
    await partnership.save();

    console.log(`✅ Partnership ${status}: ID ${partnership._id}`);

    const updatedPartnership = await Partnership.findById(partnership._id)
      .populate('organisationId', 'name email city')
      .populate('ngoId', 'name email city')
      .populate('causeId', 'name title category city');

    res.json({
      message: `Partnership ${status} successfully`,
      partnership: updatedPartnership
    });
  } catch (error) {
    console.error('❌ Update partnership error:', error);
    res.status(500).json({ error: 'Failed to update partnership' });
  }
});

// DELETE /api/partnerships/:id - Delete/cancel a partnership request
router.delete('/:id', async (req, res) => {
  try {
    const partnership = await Partnership.findByIdAndDelete(req.params.id);
    
    if (!partnership) {
      return res.status(404).json({ error: 'Partnership not found' });
    }

    console.log(`🗑️ Partnership deleted: ID ${req.params.id}`);

    res.json({ message: 'Partnership request cancelled successfully' });
  } catch (error) {
    console.error('❌ Delete partnership error:', error);
    res.status(500).json({ error: 'Failed to delete partnership' });
  }
});

module.exports = router;
