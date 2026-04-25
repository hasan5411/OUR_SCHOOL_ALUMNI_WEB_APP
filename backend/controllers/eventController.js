const Event = require('../models/Event');

// Create event (member and above)
const createEvent = async (req, res) => {
  try {
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      event_type: req.body.event_type,
      event_date: req.body.event_date,
      event_time: req.body.event_time,
      end_date: req.body.end_date,
      end_time: req.body.end_time,
      location: req.body.location,
      venue: req.body.venue,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country || 'Nigeria',
      virtual_event: req.body.virtual_event || false,
      meeting_link: req.body.meeting_link,
      meeting_platform: req.body.meeting_platform,
      max_attendees: req.body.max_attendees,
      registration_deadline: req.body.registration_deadline,
      registration_fee: req.body.registration_fee || 0,
      fee_currency: req.body.fee_currency || 'NGN',
      organizer_id: req.user.id,
      contact_email: req.body.contact_email,
      contact_phone: req.body.contact_phone,
      image_url: req.body.image_url,
      agenda: req.body.agenda,
      requirements: req.body.requirements,
      created_by: req.user.id
    };

    const event = await Event.createEvent(eventData);

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get events (public access with role-based filtering)
const getEvents = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search,
      event_type: req.query.event_type,
      status: req.query.status,
      virtual_event: req.query.virtual_event,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      sort_by: req.query.sort_by,
      sort_order: req.query.sort_order
    };

    console.log('[EventController] Fetching events with filters:', filters);

    // Non-admin users can only see upcoming/ongoing events
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      filters.status = filters.status || 'upcoming';
    }

    const result = await Event.getEvents(filters);

    // Log if there's an error in the result
    if (result._error) {
      console.error('[EventController] Model returned error:', result._error);
    }

    res.json({
      message: 'Events retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('[EventController] Get events error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message,
      hint: 'Check server logs for details'
    });
  }
};

// Get single event
const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.getEventById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user can view this event
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (event.status !== 'upcoming' && event.status !== 'ongoing' && event.status !== 'completed') {
        return res.status(404).json({ message: 'Event not found' });
      }
    }

    res.json({
      message: 'Event retrieved successfully',
      event
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update event (owner or admin)
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;

    // Check if user can update this event
    const existingEvent = await Event.getEventById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (existingEvent.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only update your own events' });
      }

      // Regular users can only update certain fields and only if not completed
      if (existingEvent.status === 'completed') {
        return res.status(403).json({ message: 'Access denied: Cannot update completed events' });
      }
    }

    const event = await Event.updateEvent(eventId, updateData);

    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete event (owner or admin)
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if user can delete this event
    const existingEvent = await Event.getEventById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (existingEvent.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only delete your own events' });
      }

      // Regular users can only delete upcoming events
      if (existingEvent.status !== 'upcoming') {
        return res.status(403).json({ message: 'Access denied: Cannot delete events that have started or completed' });
      }
    }

    await Event.deleteEvent(eventId);

    res.json({
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Register for event (member and above)
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrationData = {
      event_id: eventId,
      user_id: req.user.id,
      student_id: req.body.student_id,
      registration_status: 'registered',
      payment_status: 'pending',
      amount_paid: 0
    };

    const registration = await Event.registerForEvent(registrationData);

    res.status(201).json({
      message: 'Successfully registered for event',
      registration
    });
  } catch (error) {
    console.error('Register for event error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get event registrations
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      registration_status: req.query.registration_status
    };

    const result = await Event.getEventRegistrations(eventId, filters);

    res.json({
      message: 'Event registrations retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's event registrations
const getUserEventRegistrations = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      registration_status: req.query.registration_status
    };

    const result = await Event.getUserEventRegistrations(req.user.id, filters);

    res.json({
      message: 'User event registrations retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get user event registrations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update registration status (admin only)
const updateRegistrationStatus = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const updateData = req.body;

    const registration = await Event.updateRegistrationStatus(registrationId, updateData);

    res.json({
      message: 'Registration status updated successfully',
      registration
    });
  } catch (error) {
    console.error('Update registration status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get event statistics (admin only)
const getEventStats = async (req, res) => {
  try {
    const stats = await Event.getEventStats();

    res.json({
      message: 'Event statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations,
  getUserEventRegistrations,
  updateRegistrationStatus,
  getEventStats
};
