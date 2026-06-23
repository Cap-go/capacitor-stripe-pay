package app.capgo.stripe.pay.helper

import android.content.Context
import android.content.pm.PackageManager
import androidx.core.util.Supplier
import com.getcapacitor.Logger
import com.stripe.android.googlepaylauncher.GooglePayEnvironment

class MetaData(protected var contextSupplier: Supplier<Context>) {
    var enableGooglePay: Boolean = false
    var publishableKey: String? = null
    var countryCode: String? = null
    var displayName: String? = null
    var stripeAccount: String? = null
    var emailAddressRequired: Boolean? = null
    var phoneNumberRequired: Boolean? = null
    var billingAddressRequired: Boolean? = null
    var billingAddressFormat: String? = null
    var googlePayEnvironment: GooglePayEnvironment? = null

    var existingPaymentMethodRequired: Boolean? = null

    var enableIdentifier: Boolean = false

    init {
        try {
            val appInfo = contextSupplier
                .get()
                .packageManager
                .getApplicationInfo(contextSupplier.get().packageName, PackageManager.GET_META_DATA)

            enableGooglePay =
                appInfo.metaData.getBoolean("app.capgo.stripe.enable_google_pay")
            publishableKey =
                appInfo.metaData.getString("app.capgo.stripe.publishable_key")
            countryCode =
                appInfo.metaData.getString("app.capgo.stripe.country_code")
            displayName =
                appInfo.metaData.getString("app.capgo.stripe.merchant_display_name")
            stripeAccount =
                appInfo.metaData.getString("app.capgo.stripe.stripe_account")
            emailAddressRequired =
                appInfo.metaData.getBoolean("app.capgo.stripe.email_address_required")
            phoneNumberRequired =
                appInfo.metaData.getBoolean("app.capgo.stripe.phone_number_required")
            billingAddressRequired =
                appInfo.metaData.getBoolean("app.capgo.stripe.billing_address_required")
            billingAddressFormat =
                appInfo.metaData.getString("app.capgo.stripe.billing_address_format")
            existingPaymentMethodRequired = appInfo.metaData.getBoolean(
                "app.capgo.stripe.google_pay_existing_payment_method_required"
            )

            val isTest =
                appInfo.metaData.getBoolean("app.capgo.stripe.google_pay_is_testing")
            googlePayEnvironment = if (isTest) {
                GooglePayEnvironment.Test
            } else {
                GooglePayEnvironment.Production
            }
        } catch (ignored: Exception) {
            Logger.info("MetaData didn't be prepare fore Google Pay.")
        }
    }
}
