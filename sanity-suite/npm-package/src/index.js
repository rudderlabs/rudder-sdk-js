import * as rudderanalytics from "rudder-sdk-js";

rudderanalytics.load(
  'WRITE_KEY',
  'DATA_PLANE_URL',
  {
    logLevel: 'DEBUG',
    configUrl: 'CONTROL_PLANE_URL',
    lockIntegrationsVersion: true,
    destSDKBaseURL: 'DEST_SDK_BASE_URL'
  }
);

rudderanalytics.ready(() => {
  console.log("we are all set!!!");
});
setTimeout(() => {
  rudderanalytics.identify(
    "customUserID",
    {
      name: "John Doe",
      title: "CEO",
      email: "name.surname@domain.com",
      company: "Company123",
      phone: "123-456-7890",
      rating: "Hot",
      city: "Austin",
      postalCode: "12345",
      country: "US",
      street: "Sample Address",
      state: "TX",
    },
    () => {
      console.log("in identify call");
    }
  );
  rudderanalytics.page(
    "Home",
    "Cart Viewed",
    {
      path: "",
      referrer: "",
      search: "",
      title: "",
      url: "",
    },
    () => {
      console.log("in page call");
    }
  );

  rudderanalytics.track(
    "test track event 1",
    {
      revenue: 30,
      currency: "USD",
      user_actual_id: 12345,
    },
    () => {
      console.log("in track call 1");
    }
  );

  rudderanalytics.track(
    "test track event 2",
    {
      revenue: 45,
      currency: "INR",
      user_actual_id: 333,
    },
    () => {
      console.log("in track call 2");
    }
  );

  rudderanalytics.track(
    "test track event 3",
    {
      revenue: 10003,
      currency: "EUR",
      user_actual_id: 5678,
    },
    () => {
      console.log("in track call 3");
    }
  );
}, 5000);

export { rudderanalytics };