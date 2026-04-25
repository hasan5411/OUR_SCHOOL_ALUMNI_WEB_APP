const { supabase } = require('../config/supabase');

class Event {
  // Create a new event
  static async createEvent(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all events with filters
  static async getEvents(filters = {}) {
    try {
      let query = supabase
        .from('events')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.event_type) {
        query = query.eq('event_type', filters.event_type);
      }
      if (filters.virtual_event !== undefined) {
        query = query.eq('virtual_event', filters.virtual_event);
      }
      if (filters.organizer_id) {
        query = query.eq('organizer_id', filters.organizer_id);
      }
      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by);
      }
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      // Date range filter
      if (filters.start_date) {
        query = query.gte('event_date', filters.start_date);
      }
      if (filters.end_date) {
        query = query.lte('event_date', filters.end_date);
      }

      // Sorting
      if (filters.sort_by) {
        const column = filters.sort_by;
        const ascending = filters.sort_order === 'desc' ? false : true;
        query = query.order(column, { ascending });
      } else {
        query = query.order('event_date', { ascending: true });
      }

      // Pagination
      if (filters.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('[Event.getEvents] Supabase error:', error);
        // Return empty result instead of throwing
        return {
          events: [],
          pagination: {
            page: filters.page || 1,
            limit: filters.limit || 10,
            total: 0,
            total_pages: 0
          },
          _error: error.message
        };
      }

      return {
        events: data || [],
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / (filters.limit || 10))
        }
      };
    } catch (error) {
      console.error('[Event.getEvents] Unexpected error:', error);
      return {
        events: [],
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          total: 0,
          total_pages: 0
        },
        _error: error.message
      };
    }
  }

  // Get event by ID
  static async getEventById(eventId) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) throw error;
    return data;
  }

  // Update event
  static async updateEvent(eventId, updateData) {
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete event
  static async deleteEvent(eventId) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    return { message: 'Event deleted successfully' };
  }

  // Register for an event
  static async registerForEvent(registrationData) {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert(registrationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get event registrations
  static async getEventRegistrations(eventId, filters = {}) {
    let query = supabase
      .from('event_registrations')
      .select('*');

    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters.registration_status) {
      query = query.eq('registration_status', filters.registration_status);
    }

    // Pagination
    if (filters.page && filters.limit) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      registrations: data,
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 10,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / (filters.limit || 10))
      }
    };
  }

  // Get user's event registrations
  static async getUserEventRegistrations(userId, filters = {}) {
    let query = supabase
      .from('event_registrations')
      .select('*, events(*)')
      .eq('user_id', userId);

    if (filters.registration_status) {
      query = query.eq('registration_status', filters.registration_status);
    }

    // Pagination
    if (filters.page && filters.limit) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      registrations: data,
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 10
      }
    };
  }

  // Update registration status
  static async updateRegistrationStatus(registrationId, updateData) {
    const { data, error } = await supabase
      .from('event_registrations')
      .update(updateData)
      .eq('id', registrationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get event statistics
  static async getEventStats() {
    const [totalEvents, upcomingEvents, ongoingEvents, completedEvents, totalRegistrations] = await Promise.all([
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'ongoing'),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('event_registrations').select('*', { count: 'exact', head: true })
    ]);

    return {
      totalEvents: totalEvents.count || 0,
      upcomingEvents: upcomingEvents.count || 0,
      ongoingEvents: ongoingEvents.count || 0,
      completedEvents: completedEvents.count || 0,
      totalRegistrations: totalRegistrations.count || 0
    };
  }
}

module.exports = Event;
