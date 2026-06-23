# @capgo/capacitor-stripe-pay

<a href="https://capgo.app/"><img src="https://capgo.app/readme-banner.svg?repo=Cap-go/capacitor-stripe-pay" alt="Capgo - Instant updates for Capacitor" /></a>

<div align="center">
  <h2>
    <a href="https://capgo.app/?ref=plugin_stripe_pay"> ➡️ Get Instant updates for your App with Capgo</a>
  </h2>
  <h2>
    <a href="https://capgo.app/consulting/?ref=plugin_stripe_pay"> Missing a feature? We'll build the plugin for you 💪</a>
  </h2>
</div>

Capacitor plugin for Stripe Payment Sheet, Apple Pay, and Google Pay on iOS and Android. Maintained by Capgo with the latest Stripe SDKs and fixes from the community fork.

> **Subscriptions:** For App Store / Play Store subscriptions, use [`@capgo/native-purchases`](https://capgo.app/docs/plugins/native-purchases/) instead of this plugin.

## Documentation

The most complete documentation is available here: https://capgo.app/docs/plugins/stripe-pay/

## Compatibility

| Plugin version | Capacitor compatibility | Maintained |
| -------------- | ----------------------- | ---------- |
| v8.\*.\*       | v8.\*.\*                | ✅         |
| v7.\*.\*       | v7.\*.\*                | On demand  |

> **Note:** The major version of this plugin follows the major version of Capacitor. Use the version that matches your Capacitor installation (e.g., plugin v8 for Capacitor 8). Only the latest major version is actively maintained.

## Install

You can use our AI-Assisted Setup to install the plugin. Add the Capgo skills to your AI tool using the following command:

```bash
npx skills add https://github.com/cap-go/capacitor-skills --skill capacitor-plugins
```

Then use the following prompt:

```text
Use the `capacitor-plugins` skill from `cap-go/capacitor-skills` to install the `@capgo/capacitor-stripe-pay` plugin in my project.
```

If you prefer Manual Setup, install the plugin by running the following commands and follow the platform-specific instructions below:

```bash
# Install (choose one)
npm install @capgo/capacitor-stripe-pay
pnpm add @capgo/capacitor-stripe-pay
yarn add @capgo/capacitor-stripe-pay
bun add @capgo/capacitor-stripe-pay

# Then sync Capacitor (choose one)
npx cap sync
pnpm exec cap sync
yarn cap sync
bunx cap sync
```

## Platform setup

1. Create a [Stripe account](https://dashboard.stripe.com/register) and obtain your publishable key.
2. On your backend, create PaymentIntents or SetupIntents and return the `clientSecret` to your app.
3. Call `Stripe.initialize({ publishableKey })` once at app startup before any other Stripe API.
4. Configure Apple Pay and Google Pay in the Stripe Dashboard and native projects as described in the [Capgo docs](https://capgo.app/docs/plugins/stripe-pay/).

## Usage

```ts
import { Stripe } from '@capgo/capacitor-stripe-pay';

await Stripe.initialize({ publishableKey: 'pk_test_...' });

await Stripe.createPaymentSheet({
  paymentIntentClientSecret: 'pi_..._secret_...',
  merchantDisplayName: 'My Store',
});

const result = await Stripe.presentPaymentSheet();
console.log(result.paymentResult);
```

## API

<docgen-index>

* [`initialize(...)`](#initialize)
* [`handleURLCallback(...)`](#handleurlcallback)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### initialize(...)

```typescript
initialize(opts: StripeInitializationOptions) => Promise<void>
```

| Param      | Type                                                                                |
| ---------- | ----------------------------------------------------------------------------------- |
| **`opts`** | <code><a href="#stripeinitializationoptions">StripeInitializationOptions</a></code> |

--------------------


### handleURLCallback(...)

```typescript
handleURLCallback(opts: StripeURLHandlingOptions) => Promise<void>
```

iOS Only

| Param      | Type                                                                          |
| ---------- | ----------------------------------------------------------------------------- |
| **`opts`** | <code><a href="#stripeurlhandlingoptions">StripeURLHandlingOptions</a></code> |

--------------------


### Interfaces


#### StripeInitializationOptions

| Prop                 | Type                | Description                                       |
| -------------------- | ------------------- | ------------------------------------------------- |
| **`publishableKey`** | <code>string</code> |                                                   |
| **`stripeAccount`**  | <code>string</code> | Optional. Making API calls for connected accounts |


#### StripeURLHandlingOptions

| Prop      | Type                |
| --------- | ------------------- |
| **`url`** | <code>string</code> |

</docgen-api>
