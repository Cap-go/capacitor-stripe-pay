<p align="center"><br><a href="https://capgo.app/"><img src="https://raw.githubusercontent.com/Cap-go/capacitor-plugin-template/main/assets/capgo_banner.png" width="128" height="128" /></a></p>

<h3 align="center">Capgo Stripe Plugin</h3>
<p align="center"><strong>Official @capgo Capacitor plugin — maintained fork of @capacitor-community/stripe with bug fixes and latest SDK.</strong></p>

# @capgo/capacitor-stripe

Stripe SDK bindings for Capacitor Applications

## Install

```bash
npm install @capgo/capacitor-stripe
npx cap sync
```

## How to use

Learn at [the official @capgo/capacitor-stripe documentation](https://stripe.capacitorjs.jp/).

日本語版をご利用の際は [ja.stripe.capacitorjs.jp](https://ja.stripe.capacitorjs.jp/) をご確認ください。

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


## License

@capgo/capacitor-stripe is [MIT licensed](./LICENSE).
