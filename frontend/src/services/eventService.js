import api from './api';

export const eventService = {
  // Get events
  getEvents: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    if (filters.event_type) params.append('event_type', filters.event_type);
    if (filters.status) params.append('status', filters.status);
    if (filters.virtual_event !== undefined) params.append('virtual_event', filters.virtual_event);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);

    const response = await api.get(`/events?${params}`);
    return response.data;
  },

  // Get single event
  getEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  // Create event
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (eventId) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },

  // Register for event
  registerForEvent: async (eventId) => {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  },

  // Get event registrations
  getEventRegistrations: async (eventId, filters = {}) => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.registration_status) params.append('registration_status', filters.registration_status);

    const response = await api.get(`/events/${eventId}/registrations?${params}`);
    return response.data;
  },

  // Get user's event registrations
  getUserEventRegistrations: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.registration_status) params.append('registration_status', filters.registration_status);

    const response = await api.get(`/events/my-registrations?${params}`);
    return response.data;
  },

  // Update registration status (admin only)
  updateRegistrationStatus: async (registrationId, statusData) => {
    const response = await api.put(`/events/registrations/${registrationId}`, statusData);
    return response.data;
  },

  // Get event statistics (admin only)
  getEventStats: async () => {
    const response = await api.get('/events/stats');
    return response.data;
  }
};
