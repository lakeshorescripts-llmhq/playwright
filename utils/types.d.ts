interface Window {
    LLUtils: {
        googlePayPaymentRequest: {
            orderShipType: string;
        };
        publish: (event: string, data: unknown) => void;
    };
    mockGooglePayHandler: () => Promise<{
        redirectURL?: string;
        formError?: boolean;
        formExceptions?: unknown;
    }>;
}