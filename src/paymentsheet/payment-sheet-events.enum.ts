export enum PaymentSheetEventsEnum {
    Loaded = "paymentSheetLoaded",
    Opened = "paymentSheetOpened",
    FailedToLoad = "paymentSheetFailedToLoad",
    Completed = "paymentSheetCompleted",
    Canceled = "paymentSheetCanceled",
    Failed = "paymentSheetFailed"
}

export type PaymentSheetResultInterface =
    PaymentSheetEventsEnum.Completed
    | PaymentSheetEventsEnum.Canceled
    | PaymentSheetEventsEnum.Failed
