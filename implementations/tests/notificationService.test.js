// Mock nodemailer before requiring the service
const mockSendMail = jest.fn();

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail
  }))
}));

jest.mock('../models/Waitlist', () => ({
  getNextInQueue: jest.fn(),
  markNotified: jest.fn()
}));

const Waitlist = require('../models/Waitlist');
const notificationService = require('../services/notificationService');

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMail.mockResolvedValue({ messageId: 'test-msg-id' });
  });

  describe('notifyWaitlist', () => {
    test('notifies next user in queue', async () => {
      Waitlist.getNextInQueue.mockResolvedValue({
        id: 'w1',
        email: 'test@test.com',
        full_name: 'Test User'
      });
      Waitlist.markNotified.mockResolvedValue({});

      const result = await notificationService.notifyWaitlist('court-1', '10:00', '12:00');

      expect(result.notified).toBe(true);
      expect(result.user_email).toBe('test@test.com');
      expect(result.user_name).toBe('Test User');
      expect(result.court_id).toBe('court-1');
      expect(Waitlist.getNextInQueue).toHaveBeenCalledWith('court-1');
      expect(Waitlist.markNotified).toHaveBeenCalledWith('w1');
    });

    test('returns null when queue is empty', async () => {
      Waitlist.getNextInQueue.mockResolvedValue(null);

      const result = await notificationService.notifyWaitlist('court-1', '10:00', '12:00');

      expect(result).toBeNull();
      expect(Waitlist.markNotified).not.toHaveBeenCalled();
    });

    test('still returns result even when email fails', async () => {
      Waitlist.getNextInQueue.mockResolvedValue({
        id: 'w2',
        email: 'fail@test.com',
        full_name: 'Fail User'
      });
      Waitlist.markNotified.mockResolvedValue({});
      mockSendMail.mockRejectedValueOnce(new Error('SMTP connection failed'));

      const result = await notificationService.notifyWaitlist('court-2', '14:00', '16:00');

      expect(result.notified).toBe(true);
      expect(result.user_email).toBe('fail@test.com');
    });
  });

  describe('sendNotification', () => {
    test('sends a generic notification email', async () => {
      const result = await notificationService.sendNotification(
        'user@test.com',
        'Test Subject',
        '<p>Hello</p>'
      );

      expect(result.sent).toBe(true);
      expect(result.email).toBe('user@test.com');
    });

    test('returns sent: false when email fails', async () => {
      mockSendMail.mockRejectedValueOnce(new Error('SMTP error'));

      const result = await notificationService.sendNotification(
        'user@test.com',
        'Test Subject',
        '<p>Hello</p>'
      );

      expect(result.sent).toBe(false);
      expect(result.error).toBe('SMTP error');
    });
  });
});
