package app.capgo.stripe.paymentsheet;

enum class PaymentSheetEvents(val webEventName: String) {
    Loaded("paymentSheetLoaded"),
    FailedToLoad("paymentSheetFailedToLoad"),
    Completed("paymentSheetCompleted"),
    Canceled("paymentSheetCanceled"),
    Failed("paymentSheetFailed"),
}
