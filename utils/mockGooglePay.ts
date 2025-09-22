export interface GooglePayPayload {
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingCountry: string;
  shippingPostalCode: string;
  shippingPhoneNumber: string;
  shippingState: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  postalCode: string;
  state: string;
  cardNetwork: string;
  cardDetails: string;
  cardDisplayName: string;
  phoneNumber: string;
  useRegistryAddress: boolean | null;
  orderShipType: string;
  token: string;
  tokenType: string;
  description: string;
  email: string;
}

declare const LLUtils: {
  googlePayPaymentRequest: {
    orderShipType: string;
  };
  publish: (event: string, data: any) => void;
};

export async function applyMockGooglePay(obj: {
  useRegistryAddress: () => boolean | null;
  tpwPaymentHandler: { tpwMethodClicked: (arg: any) => void };
  goToPage: (url: string) => void;
}) {
  const paymentDataDest: GooglePayPayload = {
    shippingFirstName: "US",
    shippingLastName: "User",
    shippingAddress1: "1600 Amphitheatre Parkway1",
    shippingAddress2: "",
    shippingCity: "Mountain View",
    shippingCountry: "US",
    shippingPostalCode: "94043",
    shippingPhoneNumber: "6505555555",
    shippingState: "CA",
    firstName: "Card",
    lastName: "Holder Name",
    address1: "1600 Amphitheatre Parkway",
    address2: "",
    city: "Mountain View",
    country: "US",
    postalCode: "94043",
    state: "CA",
    cardNetwork: "VISA",
    cardDetails: "1000",
    cardDisplayName: "Card Holder Name",
    phoneNumber: "6505555555",
    useRegistryAddress: obj.useRegistryAddress(),
    orderShipType: LLUtils.googlePayPaymentRequest.orderShipType,
    token: "eyJzaWduYXR1cmUiOiJNRVFDSUNneWh4Zm1WT0lISVh6OWRBNm4zcHVma1FFMHM2c213VENnNFZrMDhqcVpBaUI0bGpNM1JJSC9jQm9POGtqdFg3ODBuK29xQkNsOVdJd0xqR0cydU1Ddll3XHUwMDNkXHUwMDNkIiwicHJvdG9jb2xWZXJzaW9uIjoiRUN2MSIsInNpZ25lZE1lc3NhZ2UiOiJ7XCJlbmNyeXB0ZWRNZXNzYWdlXCI6XCJDSE9YMkEyNTZCcjViSXRsdUI5cFA4bGdXd0ZzeEN0RnE0QjMzSE1sL2FGeXBBZ2hwZENNNDVBQU5LZHBiNXRjbE9NSDZDendpVVhKK1hBcXlQVjhUeFlHWFBScTlSUU5TTXRoRi9RYWVJQlVzUHNSV1QzTFNQRjY0OEFtejNJY0Y4V3FHQ2JiTDR0ZGlBWGt5Nk1zTHpqMjdUU05xK0xpMmxQRXcxU08zSUFMZUFqcVNTaXJjMFJzbFd0aWhpNDNSUjdUUVY4bHJJZkR4NG9ZZC9ycGdXVzJoTE12WkVVc0dieTdXVnIxVTlWZG1abjBzc2xMc1BrMXlkOWNFbmdjVTBldzE1L2xnU3VUZk5nYUxaNFIzQ2hCdEtCMVM0TXBnVGdnZkpFL0pvU1lHZW12VWtYU3Q4cVdBNDcybk42UmtiYUgwWHJBM0d6WDV0WGJ6elYzMXJMaUQrclpoS2FXaloxTm96WXF2aXE4VFlBY2hqTjJTZUN6RUVFOHNPclo1cW8zS3Z5NDdQUjErS0kxQ2dUM3UwVFQ1TWNsZWh2MVVyV0dSRnRDZ2RDZU1FZ2hMV1FcXHUwMDNkXCIsXCJlcGhlbWVyYWxQdWJsaWNLZXlcIjpcIkJMTkRWL2t4RlZ2UUZyV3V3aVIzcko3NDEwWFp4TWdaOEs4TmZJZWVLRGsvYlk5U1RWWXNkRW1DaHlGVnQyUXFsRDI3MmxBWS9GN3pRamRpRGZMNHFYRVxcdTAwM2RcIixcInRhZ1wiOlwiOHhOOVYwdCs1dUxjUjY4UXFvUlpiV2lpRUhrdk5YeklkKzRtTzdwUTNDWVxcdTAwM2RcIn0ifQ==",
    tokenType: "PAYMENT_GATEWAY",
    description: "SuccessfulAuth: Visa •••• 1000",
    email: "test@gmail.com"
  };

  try {
    const response = await fetch("/rest/model/ll/commerce/payment/googlepay/GooglePayActor/applyGooglePay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentDataDest)
    });

    const data = await response.json();

    if (data.formError) {
      LLUtils.publish("googlePayErrors", data.formExceptions);
    }

    if (response.ok) {
      obj.useRegistryAddress(null);
      obj.tpwPaymentHandler.tpwMethodClicked(null);
    }

    obj.goToPage(data.redirectURL);
  } catch (error) {
    console.error("Error applying Google Pay:", error);
  }
}
