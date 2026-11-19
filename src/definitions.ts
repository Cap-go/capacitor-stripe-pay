import type { ApplePayDefinitions } from './applepay/index.js';
import type { GooglePayDefinitions } from './googlepay/index.js';
import type { PaymentFlowDefinitions } from './paymentflow/index.js';
import type { PaymentSheetDefinitions } from './paymentsheet/index.js';

export * from './applepay/index.js';
export * from './googlepay/index.js';
export * from './paymentflow/index.js';
export * from './paymentsheet/index.js';
export * from './shared/index.js';

type StripeDefinitions = PaymentSheetDefinitions & PaymentFlowDefinitions & ApplePayDefinitions & GooglePayDefinitions;

export interface StripePlugin extends StripeDefinitions {
  initialize(opts: StripeInitializationOptions): Promise<void>;
  /**
   * iOS Only
   * @url https://stripe.com/docs/payments/3d-secure#return-url
   */
  handleURLCallback?(opts: StripeURLHandlingOptions): Promise<void>;
}

export interface StripeInitializationOptions {
  publishableKey: string;

  /**
   * Optional. Making API calls for connected accounts
   * @info https://stripe.com/docs/connect/authentication
   */
  stripeAccount?: string;
}

export interface StripeURLHandlingOptions {
  url: string;
}

export interface CapacitorStripeContext {
  stripe: StripePlugin;
  isApplePayAvailable: boolean;
  isGooglePayAvailable: boolean;
}
