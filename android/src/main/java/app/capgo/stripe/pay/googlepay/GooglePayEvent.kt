package app.capgo.stripe.pay.googlepay;

enum class GooglePayEvents(val webEventName: String) {
    Loaded("googlePayLoaded"),
    FailedToLoad("googlePayFailedToLoad"),
    Completed("googlePayCompleted"),
    Canceled("googlePayCanceled"),
    Failed("googlePayFailed"),
}
