package app.capgo.stripe;

import com.google.android.gms.wallet.PaymentData

internal abstract class GooglePayCallback {
    abstract fun onSuccess(res: PaymentData)
    abstract fun onError(err: Exception)
}
