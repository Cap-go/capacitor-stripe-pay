package app.capgo.stripe.pay.paymentflow;

enum class PaymentFlowEvents(val webEventName: String) {
    Loaded("paymentFlowLoaded"),
    FailedToLoad("paymentFlowFailedToLoad"),
    Opened("paymentFlowOpened"),
    FailedToOpen("paymentFlowFailedToOpen"),
    Completed("paymentFlowCompleted"),
    Canceled("paymentFlowCanceled"),
    Failed("paymentFlowFailed"),
    Created("paymentFlowCreated"),
}
