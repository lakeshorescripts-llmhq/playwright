// utils/mockApplePaySession.ts

export function getMockApplePayScript(): string {
  return `
    window.ApplePaySession = class {
      constructor(version, request) {
        this.version = version;
        this.request = request;
        this.onvalidatemerchant = null;
        this.onpaymentauthorized = null;
        this.oncancel = null;
      }

      static canMakePayments() {
        return true;
      }

      static supportsVersion(version) {
        return version >= 1;
      }

      begin() {
        console.log('[MockApplePay] Session started');

        // Simulate merchant validation
        setTimeout(() => {
          if (typeof this.onvalidatemerchant === 'function') {
            console.log('[MockApplePay] Triggering merchant validation');
            this.onvalidatemerchant({
              validationURL: 'https://apple-pay-gateway.apple.com/paymentservices/startSession'
            });
          }
        }, 500);

        // Simulate payment authorization and redirect
        setTimeout(() => {
          if (typeof this.onpaymentauthorized === 'function') {
            console.log('[MockApplePay] Triggering payment authorization');
            this.onpaymentauthorized({
              payment: {
                token: {
                  paymentData: {
                    version: 'EC_v1',
                    data: 'mock_encrypted_data',
                    signature: 'mock_signature',
                    header: {
                      ephemeralPublicKey: 'mock_key',
                      publicKeyHash: 'mock_hash',
                      transactionId: 'mock_txn_id'
                    }
                  }
                },
                billingContact: {
                  givenName: 'John',
                  familyName: 'Doe',
                  emailAddress: 'john.doe@example.com',
                  phoneNumber: '+1234567890',
                  addressLines: ['123 Test St'],
                  locality: 'Testville',
                  administrativeArea: 'CA',
                  postalCode: '90001',
                  countryCode: 'US'
                },
                shippingContact: {
                  givenName: 'John',
                  familyName: 'Doe',
                  addressLines: ['123 Test St'],
                  locality: 'Testville',
                  administrativeArea: 'CA',
                  postalCode: '90001',
                  countryCode: 'US'
                }
              }
            });

            // ✅ Simulate redirect to checkout page
            console.log('[MockApplePay] Redirecting to checkout...');
            window.location.href = '/order-confirmation-page'; // Adjust path if needed
          }
        }, 1000);
      }

      completeMerchantValidation(merchantSession) {
        console.log('[MockApplePay] Merchant validation completed:', merchantSession);
      }

      completePayment(status) {
        console.log('[MockApplePay] Payment completed with status:', status);
      }

      abort() {
        console.log('[MockApplePay] Session aborted');
        if (typeof this.oncancel === 'function') {
          this.oncancel();
        }
      }
    };
  `;
}
