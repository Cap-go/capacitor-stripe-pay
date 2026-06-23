import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Capacitor } from '@capacitor/core';
import { Stripe } from '@capgo/capacitor-stripe';

const publishableKeyInput = document.getElementById('publishableKey');
const stripeAccountInput = document.getElementById('stripeAccount');
const initializeButton = document.getElementById('initializeButton');
const paymentSheetOptionsInput = document.getElementById('paymentSheetOptions');
const createPaymentSheetButton = document.getElementById('createPaymentSheetButton');
const presentPaymentSheetButton = document.getElementById('presentPaymentSheetButton');
const statusLine = document.getElementById('statusLine');
const outputLog = document.getElementById('outputLog');

const setStatus = (message) => {
  if (statusLine) statusLine.textContent = `Status: ${message}`;
};

const logResult = (data) => {
  if (outputLog) outputLog.textContent = JSON.stringify(data, null, 2);
};

const parseJsonInput = (inputElement, label) => {
  const raw = inputElement?.value?.trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} JSON invalid: ${message}`);
  }
};

initializeButton?.addEventListener('click', async () => {
  try {
    setStatus('Initializing...');
    const publishableKey = publishableKeyInput?.value?.trim();
    const stripeAccount = stripeAccountInput?.value?.trim();
    if (!publishableKey) throw new Error('Publishable key is required.');
    await Stripe.initialize({
      publishableKey,
      ...(stripeAccount ? { stripeAccount } : {}),
    });
    setStatus('Initialized');
    logResult({ initialized: true, publishableKey, stripeAccount: stripeAccount || null });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`Initialize failed: ${message}`);
    logResult({ error: message });
  }
});

createPaymentSheetButton?.addEventListener('click', async () => {
  try {
    setStatus('Creating payment sheet...');
    const options = parseJsonInput(paymentSheetOptionsInput, 'Payment sheet');
    await Stripe.createPaymentSheet(options);
    setStatus('Payment sheet created');
    logResult({ phase: 'createPaymentSheet', options });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`Create failed: ${message}`);
    logResult({ error: message });
  }
});

presentPaymentSheetButton?.addEventListener('click', async () => {
  try {
    setStatus('Presenting payment sheet...');
    const result = await Stripe.presentPaymentSheet();
    setStatus('Payment sheet finished');
    logResult({ phase: 'presentPaymentSheet', result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`Present failed: ${message}`);
    logResult({ error: message });
  }
});

if (Capacitor.isNativePlatform()) {
  CapacitorUpdater.notifyAppReady().catch((error) => {
    console.error('Capgo notifyAppReady failed', error);
  });
}
