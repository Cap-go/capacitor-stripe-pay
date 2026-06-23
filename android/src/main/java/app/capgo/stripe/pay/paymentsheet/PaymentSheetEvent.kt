package app.capgo.stripe.pay.paymentsheet;

enum class PaymentSheetEvents(val webEventName: String) {
    Loaded("paymentSheetLoaded"),
    FailedToLoad("paymentSheetFailedToLoad"),
    Completed("paymentSheetCompleted"),
    Canceled("paymentSheetCanceled"),
    Failed("paymentSheetFailed"),
}
