const { supabase } = require('../config/database');

// Get all events (with role-based access)
const getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, upcoming } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('events')
      .select(`
        id,
        title,
        description,
        event_date,
        location,
        image_url,
        is_public,
        created_at,
        updated_at,
        created_by,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `, { count: 'exact' });

    // Apply visibility rules
    if (req.user.roles?.name === 'visitor' || !req.user.is_approved) {
      query = query.eq('is_public', true);
    }

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
    }

    // Upcoming events filter
    if (upcoming === 'true') {
      query = query.gte('event_date', new Date().toISOString());
    }

    query = query
      .order('event_date', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data: events, error, count } = await query;

    if (error) {
      console.error('Get events error:', error);
      return res.status(500).json({ message: 'Error fetching events' });
    }

    // Get registration counts for each event
    const eventsWithRegistrations = await Promise.all(
      (events || []).map(async (event) => {
        const { data: registrations } = await supabase
          .from('event_registrations')
          .select('id')
          .eq('event_id', event.id);

        return {
          ...event,
          registration_count: registrations?.length || 0
        };
      })
    );

    res.json({
      events: eventsWithRegistrations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    let query = supabase
      .from('events')
      .select(`
        id,
        title,
        description,
        event_date,
        location,
        image_url,
        is_public,
        created_at,
        updated_at,
        created_by,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `)
      .eq('id', eventId)
      .single();

    // Apply visibility rules
    if (req.user.roles?.name === 'visitor' || !req.user.is_approved) {
      query = query.eq('is_public', true);
    }

    const { data: event, error } = await query;

    if (error || !event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get registrations
    const { data: registrations } = await supabase
      .from('event_registrations')
      .select(`
        id,
        registration_date,
        status,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `)
      .eq('event_id', eventId)
      .eq('status', 'registered');

    // Check if current user is registered
    let userRegistered = false;
    if (req.user) {
      const { data: userReg } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', req.user.id)
        .single();
      
      userRegistered = !!userReg;
    }

    res.json({
      event: {
        ...event,
        registrations: registrations || [],
        registration_count: registrations?.length || 0,
        user_registered: userRegistered
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create event (admin/authority only)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      event_date,
      location,
      image_url,
      is_public
    } = req.body;

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        event_date,
        location,
        image_url,
        is_public,
        created_by: req.user.id
      })
      .select(`
        id,
        title,
        description,
        event_date,
        location,
        image_url,
        is_public,
        created_at,
        updated_at,
        created_by,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `)
      .single();

    if (error || !event) {
      console.error('Create event error:', error);
      return res.status(400).json({ message: 'Error creating event' });
    }

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update event (admin/authority only)
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      title,
      description,
      event_date,
      location,
      image_url,
      is_public
    } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (event_date !== undefined) updateData.event_date = event_date;
    if (location !== undefined) updateData.location = location;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (is_public !== undefined) updateData.is_public = is_public;

    const { data: event, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', eventId)
      .select(`
        id,
        title,
        description,
        event_date,
        location,
        image_url,
        is_public,
        updated_at,
        created_by,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `)
      .single();

    if (error || !event) {
      return res.status(400).json({ message: 'Error updating event' });
    }

    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete event (authority only)
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Delete event error:', error);
      return res.status(400).json({ message: 'Error deleting event' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Register for event (approved users only)
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists and is accessible
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, is_public, event_date')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is in the future
    if (new Date(event.event_date) < new Date()) {
      return res.status(400).json({ message: 'Cannot register for past events' });
    }

    // Check if user is already registered
    const { data: existingRegistration } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', req.user.id)
      .single();

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Register user
    const { data: registration, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: req.user.id,
        registration_date: new Date().toISOString(),
        status: 'registered'
      })
      .select(`
        id,
        registration_date,
        status,
        events(id, title, event_date),
        users(id, first_name, last_name)
      `)
      .single();

    if (error || !registration) {
      console.error('Register for event error:', error);
      return res.status(400).json({ message: 'Error registering for event' });
    }

    res.status(201).json({
      message: 'Successfully registered for event',
      registration
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Unregister from event
const unregisterFromEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Unregister from event error:', error);
      return res.status(400).json({ message: 'Error unregistering from event' });
    }

    res.json({ message: 'Successfully unregistered from event' });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent
};
