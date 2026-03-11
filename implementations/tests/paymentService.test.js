// Mock stripe before requiring paymentService
const mockChargesCreate = jest.fn();
const mockRefundsCreate = jest.fn();

jest.mock('stripe', () => {
  return jest.fn(() => ({
    charges: { create: mockChargesCreate },
    refunds: { create: mockRefundsCreate }
  }));
});

const paymentService = require('../services/paymentService');

describe('Payment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('processPayment returns transaction_id on success', async () => {
    mockChargesCreate.mockResolvedValue({
      id: 'ch_test_123',
      amount: 50000,
      currency: 'thb',
      status: 'succeeded'
    });

    const result = await paymentService.processPayment({
      booking_id: 'test-booking-123',
      amount: 500,
      method: 'CREDIT_CARD',
      credit_card_token: 'tok_visa'
    });

    expect(result.success).toBe(true);
    expect(result.transaction_id).toBe('ch_test_123');
    expect(result.amount).toBe(500);
    expect(result.method).toBe('CREDIT_CARD');
    expect(result.timestamp).toBeDefined();
    expect(mockChargesCreate).toHaveBeenCalledWith({
      amount: 50000,
      currency: 'thb',
      source: 'tok_visa',
      description: 'Booking test-booking-123',
      metadata: { booking_id: 'test-booking-123', method: 'CREDIT_CARD' }
    });
  });

  test('processPayment throws on stripe failure', async () => {
    mockChargesCreate.mockRejectedValue(new Error('Card declined'));

    await expect(paymentService.processPayment({
      booking_id: 'test-booking-456',
      amount: 300,
      method: 'CREDIT_CARD',
      credit_card_token: 'tok_chargeDeclined'
    })).rejects.toThrow('Payment failed: Card declined');
  });

  test('processRefund returns refund_id on success', async () => {
    mockRefundsCreate.mockResolvedValue({
      id: 're_test_123',
      status: 'succeeded'
    });

    const result = await paymentService.processRefund('ch_test_123');

    expect(result.success).toBe(true);
    expect(result.refund_id).toBe('re_test_123');
    expect(result.timestamp).toBeDefined();
    expect(mockRefundsCreate).toHaveBeenCalledWith({
      charge: 'ch_test_123'
    });
  });

  test('processRefund throws on stripe failure', async () => {
    mockRefundsCreate.mockRejectedValue(new Error('Charge not found'));

    await expect(paymentService.processRefund('ch_invalid'))
      .rejects.toThrow('Refund failed: Charge not found');
  });
});
