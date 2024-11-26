const paypal = require('@paypal/checkout-server-sdk');

// PayPal Environment Configuration
const Environment = paypal.core.SandboxEnvironment; // Use Sandbox for testing
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
);

// Create PayPal order
const createOrder = async (amount) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: amount
      }
    }]
  });

  try {
    const order = await paypalClient.execute(request);
    return order.result.id; // Return the order ID to be used by the client
  } catch (err) {
    console.error('Error creating PayPal order:', err);
    throw new Error('Error creating PayPal order');
  }
};

// Capture PayPal order
const captureOrder = async (orderID) => {
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await paypalClient.execute(request);
    return capture;
  } catch (err) {
    console.error('Error capturing PayPal order:', err);
    throw new Error('Error capturing PayPal order');
  }
};

module.exports = { createOrder, captureOrder };
