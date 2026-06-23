import { WebPlugin } from '@capacitor/core';
import type { Stripe, StripeCardNumberElement } from '@stripe/stripe-js';
import type { Components } from 'stripe-pwa-elements';
import type { FormSubmitEvent } from 'stripe-pwa-elements/dist/types/interfaces';
import type { HTMLStencilElement } from 'stripe-pwa-elements/dist/types/stencil-public-runtime';

import type {
  ApplePayResultInterface,
  CreateApplePayOption,
  CreateGooglePayOption,
  CreatePaymentFlowOption,
  CreatePaymentSheetOption,
  GooglePayResultInterface,
  PaymentFlowResultInterface,
  PaymentSheetResultInterface,
  StripeInitializationOptions,
  StripePlugin,
} from './definitions';
import { ApplePayEventsEnum, GooglePayEventsEnum, PaymentFlowEventsEnum, PaymentSheetEventsEnum } from './definitions';
import { isPlatform } from './shared/platform';

interface StripeCardElementModal extends Components.StripeCardElementModal, HTMLStencilElement, HTMLElement {}

interface StripeRequestButton extends Components.StripePaymentRequestButton, HTMLStencilElement, HTMLElement {}

export class StripeWeb extends WebPlugin implements StripePlugin {
  private ensureModalVisible(modal: StripeCardElementModal): void {
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.zIndex = '2147483647';
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
  }

  private publishableKey: string | undefined;
  private stripeAccount: string | undefined;
  private cardElementModal: StripeCardElementModal | undefined;

  private flowStripe: Stripe | undefined;
  private flowCardNumberElement: StripeCardNumberElement | undefined;

  private requestApplePay: StripeRequestButton | undefined;
  private requestApplePayOptions: CreateApplePayOption | undefined;

  private requestGooglePay: StripeRequestButton | undefined;
  private requestGooglePayOptions: CreateGooglePayOption | undefined;

  async initialize(options: StripeInitializationOptions): Promise<void> {
    if (typeof options.publishableKey !== 'string' || options.publishableKey.trim().length === 0) {
      throw new Error('you must provide a valid key');
    }
    this.publishableKey = options.publishableKey;

    if (options.stripeAccount) {
      this.stripeAccount = options.stripeAccount;
    }
  }

  async createPaymentSheet(options: CreatePaymentSheetOption): Promise<void> {
    if (!this.publishableKey) {
      this.notifyListeners(PaymentSheetEventsEnum.FailedToLoad, null);
      return;
    }

    this.cardElementModal = document.createElement('stripe-card-element-modal');
    document.querySelector('body')?.appendChild(this.cardElementModal);
    await customElements.whenDefined('stripe-card-element-modal');

    this.cardElementModal.publishableKey = this.publishableKey;

    if (this.stripeAccount) {
      this.cardElementModal.stripeAccount = this.stripeAccount;
    }

    this.cardElementModal.applicationName = '@capgo/capacitor-stripe-pay';

    this.cardElementModal.intentClientSecret = options.paymentIntentClientSecret;
    this.cardElementModal.intentType = 'payment';

    if (options.stripeAccount) {
      this.cardElementModal.stripeAccount = options.stripeAccount;
    }

    this.ensureModalVisible(this.cardElementModal);
    if (options.withZipCode !== undefined) {
      this.cardElementModal.zip = options.withZipCode;
    }

    this.notifyListeners(PaymentSheetEventsEnum.Loaded, null);
  }

  async presentPaymentSheet(): Promise<{
    paymentResult: PaymentSheetResultInterface;
  }> {
    if (!this.cardElementModal) {
      throw new Error('Payment sheet not created. Call createPaymentSheet() first.');
    }

    this.ensureModalVisible(this.cardElementModal);
    this.notifyListeners(PaymentSheetEventsEnum.Opened, null);

    const props = await this.cardElementModal.present();
    if (props === undefined) {
      this.notifyListeners(PaymentSheetEventsEnum.Canceled, null);
      return {
        paymentResult: PaymentSheetEventsEnum.Canceled,
      };
    }

    const {
      detail: { stripe, cardNumberElement },
    } = props as {
      detail: FormSubmitEvent;
    };

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });
    this.cardElementModal.updateProgress('success');
    this.cardElementModal.remove();

    if (result.error !== undefined) {
      this.notifyListeners(PaymentSheetEventsEnum.Failed, null);
      return {
        paymentResult: PaymentSheetEventsEnum.Failed,
      };
    }

    this.notifyListeners(PaymentSheetEventsEnum.Completed, null);

    return {
      paymentResult: PaymentSheetEventsEnum.Completed,
    };
  }

  async createPaymentFlow(options: CreatePaymentFlowOption): Promise<void> {
    if (!this.publishableKey) {
      this.notifyListeners(PaymentFlowEventsEnum.FailedToLoad, null);
      return;
    }

    this.cardElementModal = document.createElement('stripe-card-element-modal');
    document.querySelector('body')?.appendChild(this.cardElementModal);
    await customElements.whenDefined('stripe-card-element-modal');

    this.cardElementModal.publishableKey = this.publishableKey;

    if (this.stripeAccount) {
      this.cardElementModal.stripeAccount = this.stripeAccount;
    }

    this.cardElementModal.applicationName = '@capgo/capacitor-stripe-pay';

    // eslint-disable-next-line no-prototype-builtins
    if (options.hasOwnProperty('paymentIntentClientSecret')) {
      this.cardElementModal.intentType = 'payment';
      this.cardElementModal.intentClientSecret = options.paymentIntentClientSecret;
    } else {
      this.cardElementModal.intentType = 'setup';
      this.cardElementModal.intentClientSecret = options.setupIntentClientSecret;
    }
    if (options.withZipCode !== undefined) {
      this.cardElementModal.zip = options.withZipCode;
    }

    if (isPlatform(window, 'ios')) {
      this.cardElementModal.buttonLabel = 'Add card';
      this.cardElementModal.sheetTitle = 'Add a card';
    } else {
      this.cardElementModal.buttonLabel = 'Add';
    }

    this.notifyListeners(PaymentFlowEventsEnum.Loaded, null);
  }

  async presentPaymentFlow(): Promise<{
    cardNumber: string;
  }> {
    if (!this.cardElementModal) {
      throw new Error();
    }

    this.notifyListeners(PaymentFlowEventsEnum.Opened, null);
    const props = await this.cardElementModal.present().catch(() => undefined);
    if (props === undefined) {
      this.notifyListeners(PaymentFlowEventsEnum.Canceled, null);
      throw new Error();
    }

    const {
      detail: { stripe, cardNumberElement },
    } = props as {
      detail: FormSubmitEvent;
    };

    const { token } = await stripe.createToken(cardNumberElement);
    if (token === undefined || token.card === undefined) {
      throw new Error();
    }

    this.flowStripe = stripe as Stripe;
    this.flowCardNumberElement = cardNumberElement;

    this.notifyListeners(PaymentFlowEventsEnum.Created, {
      cardNumber: token.card.last4,
    });
    return {
      cardNumber: token.card.last4,
    };
  }

  async confirmPaymentFlow(): Promise<{
    paymentResult: PaymentFlowResultInterface;
  }> {
    if (!this.cardElementModal || !this.flowStripe || !this.flowCardNumberElement) {
      throw new Error();
    }

    const result = await this.flowStripe.createPaymentMethod({
      type: 'card',
      card: this.flowCardNumberElement,
    });

    if (result.error !== undefined) {
      this.notifyListeners(PaymentFlowEventsEnum.Failed, null);
    }

    this.cardElementModal.updateProgress('success');
    this.cardElementModal.remove();

    this.notifyListeners(PaymentFlowEventsEnum.Completed, null);
    return {
      paymentResult: PaymentFlowEventsEnum.Completed,
    };
  }

  isApplePayAvailable(): Promise<void> {
    return this.isAvailable('applePay');
  }

  async createApplePay(createApplePayOption: CreateApplePayOption): Promise<void> {
    if (!this.publishableKey) {
      this.notifyListeners(ApplePayEventsEnum.FailedToLoad, null);
      return;
    }
    this.requestApplePay = await this.createPaymentRequestButton();
    this.requestApplePayOptions = createApplePayOption;
    this.notifyListeners(ApplePayEventsEnum.Loaded, null);
  }

  async updateApplePaySheet(_options: { paymentSummaryItems: { label: string; amount: number }[] }): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  presentApplePay(): Promise<{
    paymentResult: ApplePayResultInterface;
  }> {
    return this.presentPaymentRequestButton(
      'applePay',
      this.requestApplePay,
      this.requestApplePayOptions,
      ApplePayEventsEnum,
    ) as Promise<{
      paymentResult: ApplePayResultInterface;
    }>;
  }

  isGooglePayAvailable(): Promise<void> {
    return this.isAvailable('googlePay');
  }

  async createGooglePay(createGooglePayOption: CreateGooglePayOption): Promise<void> {
    if (!this.publishableKey) {
      this.notifyListeners(GooglePayEventsEnum.FailedToLoad, null);
      return;
    }
    this.requestGooglePay = await this.createPaymentRequestButton();
    this.requestGooglePayOptions = createGooglePayOption;
    this.notifyListeners(GooglePayEventsEnum.Loaded, null);
  }

  presentGooglePay(): Promise<{
    paymentResult: GooglePayResultInterface;
  }> {
    return this.presentPaymentRequestButton(
      'googlePay',
      this.requestGooglePay,
      this.requestGooglePayOptions,
      GooglePayEventsEnum,
    ) as Promise<{
      paymentResult: GooglePayResultInterface;
    }>;
  }

  private async isAvailable(type: 'applePay' | 'googlePay'): Promise<void> {
    const requestButton = document.createElement('stripe-payment-request-button');
    requestButton.id = `isAvailable-${type}`;
    document.querySelector('body')?.appendChild(requestButton);
    await customElements.whenDefined('stripe-payment-request-button');

    if (this.publishableKey) {
      requestButton.publishableKey = this.publishableKey;
    }

    if (this.stripeAccount) {
      requestButton.stripeAccount = this.stripeAccount;
    }

    requestButton.applicationName = '@capgo/capacitor-stripe-pay';
    return await requestButton.isAvailable(type).finally(() => requestButton.remove());
  }

  private async createPaymentRequestButton(): Promise<StripeRequestButton> {
    const requestButton = document.createElement('stripe-payment-request-button');
    document.querySelector('body')?.appendChild(requestButton);
    await customElements.whenDefined('stripe-payment-request-button');

    if (this.publishableKey) {
      requestButton.publishableKey = this.publishableKey;
    }

    if (this.stripeAccount) {
      requestButton.stripeAccount = this.stripeAccount;
    }

    requestButton.applicationName = '@capgo/capacitor-stripe-pay';

    return requestButton;
  }

  private async presentPaymentRequestButton(
    type: 'applePay' | 'googlePay',
    requestButton: StripeRequestButton | undefined,
    requestButtonOptions: CreateApplePayOption | CreateGooglePayOption | undefined,
    EventsEnum: typeof ApplePayEventsEnum | typeof GooglePayEventsEnum,
  ): Promise<{
    paymentResult: ApplePayResultInterface | GooglePayResultInterface;
  }> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (requestButton === undefined || requestButtonOptions === undefined || this.publishableKey === undefined) {
        this.notifyListeners(EventsEnum.Failed, null);
        return resolve({
          paymentResult: EventsEnum.Failed,
        });
      }

      const googlePayOptions = requestButtonOptions as CreateGooglePayOption;
      const requiresShipping =
        type === 'googlePay' && (googlePayOptions.requiredShippingContactFields?.includes('postalAddress') ?? false);

      await requestButton.setPaymentRequestOption({
        country: requestButtonOptions.countryCode!.toUpperCase(),
        currency: requestButtonOptions.currency!.toLowerCase(),
        total: requestButtonOptions.paymentSummaryItems![requestButtonOptions.paymentSummaryItems!.length - 1],
        disableWallets: type === 'applePay' ? ['googlePay', 'browserCard'] : ['applePay', 'browserCard'],
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: requiresShipping,
      });

      if (requiresShipping) {
        await requestButton.setPaymentRequestShippingAddressEventHandler(async (event) => {
          event.updateWith({ status: 'success' });
        });
      }
      const intentClientSecret = requestButtonOptions.paymentIntentClientSecret;
      await requestButton.setPaymentMethodEventHandler(async (event, stripe) => {
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
          intentClientSecret,
          {
            payment_method: event.paymentMethod.id,
          },
          { handleActions: false },
        );
        if (confirmError) {
          event.complete('fail');
          this.notifyListeners(EventsEnum.Failed, confirmError);
          return resolve({
            paymentResult: EventsEnum.Failed,
          });
        }
        if (paymentIntent?.status === 'requires_action') {
          const { error: confirmError } = await stripe.confirmCardPayment(intentClientSecret);
          if (confirmError) {
            event.complete('fail');
            this.notifyListeners(EventsEnum.Failed, confirmError);
            return resolve({
              paymentResult: EventsEnum.Failed,
            });
          }
        }
        event.complete('success');
        const shippingContact = event.shippingAddress ?? event.paymentMethod?.billing_details;
        this.notifyListeners(EventsEnum.Completed, shippingContact ? { contact: shippingContact } : null);
        return resolve({
          paymentResult: EventsEnum.Completed,
        });
      });
      await requestButton.initStripe(this.publishableKey, {
        stripeAccount: this.stripeAccount,
        showButton: false,
      });
    });
  }
}
