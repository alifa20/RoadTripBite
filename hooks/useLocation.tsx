import { useEffect, useState } from "react";
import BackgroundGeolocation, {
  Location as BgLocation,
  Subscription,
} from "react-native-background-geolocation";

type Location = BgLocation | null;

export const useLocation = () => {
  const [location, setLocation] = useState<Location>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    /// 1.  Subscribe to events.
    const onLocation: Subscription = BackgroundGeolocation.onLocation(
      (location) => {
        console.log("[onLocation]", location);
        // setLocation(JSON.stringify(location, null, 2));
        setLocation(location);
      }
    );

    const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange(
      (event) => {
        console.log("[onMotionChange]", event);
      }
    );

    const onActivityChange: Subscription =
      BackgroundGeolocation.onActivityChange((event) => {
        console.log("[onActivityChange]", event);
      });

    const onProviderChange: Subscription =
      BackgroundGeolocation.onProviderChange((event) => {
        console.log("[onProviderChange]", event);
      });

    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      locationAuthorizationRequest: "WhenInUse",
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true, // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      //   url: "http://yourserver.com/locations",
      batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
      //   headers: {
      //     // <-- Optional HTTP headers
      //     "X-FOO": "bar",
      //   },
      //   params: {
      //     // <-- Optional HTTP params
      //     auth_token: "maybe_your_server_authenticates_via_token_YES?",
      //   },
    }).then((state) => {
      setEnabled(true);
      console.log(
        "- BackgroundGeolocation is configured and ready: ",
        JSON.stringify(state.enabled)
      );
    });

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  }, []);

  /// 3. start / stop BackgroundGeolocation
  useEffect(() => {
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation(null);
    }
  }, [enabled]);

  return { location, enabled, setEnabled };
};
