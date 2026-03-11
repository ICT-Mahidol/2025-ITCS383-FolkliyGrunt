const request = require('supertest');
const app = require('../server');

// Mock dependencies
jest.mock('../config/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      getUser: jest.fn(),
      signOut: jest.fn(),
    }
  },
  supabaseAdmin: {
    auth: {
      admin: {
        updateUserById: jest.fn()
      }
    }
  }
}));

jest.mock('../config/db', () => ({
  query: jest.fn(),
  connect: jest.fn(),
  on: jest.fn(),
}));

jest.mock('../models/Waitlist');

const { supabase } = require('../config/supabase');
const pool = require('../config/db');
const Waitlist = require('../models/Waitlist');

// Helper to mock authenticated user
function mockAuthenticatedUser() {
  supabase.auth.getUser.mockResolvedValue({
    data: { user: { id: 'auth-uuid-123', email: 'test@example.com' } },
    error: null
  });
  pool.query.mockResolvedValue({
    rows: [{ id: 'profile-uuid', auth_id: 'auth-uuid-123', role: 'CUSTOMER' }]
  });
}

describe('Waitlist API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/waitlist', () => {
    it('should add user to waitlist', async () => {
      mockAuthenticatedUser();
      const mockEntry = {
        id: 'waitlist-uuid-1',
        user_id: 'auth-uuid-123',
        court_id: 'court-uuid-1',
        requested_date: '2026-03-15',
        preferred_time_slot: '10:00-12:00',
        status: 'PENDING'
      };
      Waitlist.add.mockResolvedValue(mockEntry);

      const response = await request(app)
        .post('/api/waitlist')
        .set('Authorization', 'Bearer valid-token')
        .send({
          court_id: 'court-uuid-1',
          requested_date: '2026-03-15',
          preferred_time_slot: '10:00-12:00'
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBe('waitlist-uuid-1');
      expect(response.body.status).toBe('PENDING');
      expect(Waitlist.add).toHaveBeenCalledWith({
        user_id: 'auth-uuid-123',
        court_id: 'court-uuid-1',
        requested_date: '2026-03-15',
        preferred_time_slot: '10:00-12:00'
      });
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/waitlist')
        .send({
          court_id: 'court-uuid-1',
          requested_date: '2026-03-15'
        });

      expect(response.status).toBe(401);
    });

    it('should return 500 on database error', async () => {
      mockAuthenticatedUser();
      Waitlist.add.mockRejectedValue(new Error('DB connection failed'));

      const response = await request(app)
        .post('/api/waitlist')
        .set('Authorization', 'Bearer valid-token')
        .send({
          court_id: 'court-uuid-1',
          requested_date: '2026-03-15'
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('DB connection failed');
    });
  });

  describe('GET /api/waitlist/my', () => {
    it('should return user waitlist entries', async () => {
      mockAuthenticatedUser();
      const mockEntries = [
        {
          id: 'w1',
          court_name: 'Court A',
          requested_date: '2026-03-15',
          preferred_time_slot: '10:00-12:00',
          status: 'PENDING'
        },
        {
          id: 'w2',
          court_name: 'Court B',
          requested_date: '2026-03-16',
          preferred_time_slot: '14:00-16:00',
          status: 'NOTIFIED'
        }
      ];
      Waitlist.findByUser.mockResolvedValue(mockEntries);

      const response = await request(app)
        .get('/api/waitlist/my')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].court_name).toBe('Court A');
      expect(Waitlist.findByUser).toHaveBeenCalledWith('auth-uuid-123');
    });

    it('should return empty array when no entries', async () => {
      mockAuthenticatedUser();
      Waitlist.findByUser.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/waitlist/my')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('DELETE /api/waitlist/:id', () => {
    it('should remove a waitlist entry', async () => {
      mockAuthenticatedUser();
      Waitlist.remove.mockResolvedValue({
        id: 'w1',
        user_id: 'auth-uuid-123',
        status: 'PENDING'
      });

      const response = await request(app)
        .delete('/api/waitlist/w1')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Removed from waitlist');
      expect(Waitlist.remove).toHaveBeenCalledWith('w1', 'auth-uuid-123');
    });

    it('should return 404 if entry not found', async () => {
      mockAuthenticatedUser();
      Waitlist.remove.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/waitlist/nonexistent')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Waitlist entry not found');
    });
  });
});
