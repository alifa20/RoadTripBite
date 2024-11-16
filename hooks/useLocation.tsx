import { useEffect, useState } from "react";
import BackgroundGeolocation, {
  Location as BgLocation,
  Subscription,
} from "react-native-background-geolocation";
import { useDispatch } from "react-redux";
import { setAvgSpeed, setSpeed } from "@/store/odometerSlice";

type Location = BgLocation | null;

interface SpeedData {
  currentSpeed: number; // Current speed in m/s
  avgSpeed: number; // Average speed in m/s
  speedReadings: number[]; // Array of recent speed readings
  lastUpdated: Date; // Timestamp of last update
}

// Keep last 10 readings for a rolling average
const SPEED_WINDOW_SIZE = 10;

export const useLocation = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState<Location>(null);
  const [enabled, setEnabled] = useState(false);
  const [speedData, setSpeedData] = useState<SpeedData>({
    currentSpeed: 0,
    avgSpeed: 0,
    speedReadings: [],
    lastUpdated: new Date(),
  });

  useEffect(() => {
    /// 1.  Subscribe to events.
    const onLocation: Subscription = BackgroundGeolocation.onLocation(
      (location) => {
        console.log("[onLocation]", location);
        setLocation(location);

        // Update speed data when we get a new location
        if (location.coords?.speed != null) {
          const currentSpeed = Math.max(location.coords.speed ?? 0, 0);

          // Update Redux store with current speed
          dispatch(setSpeed(currentSpeed));

          // Update local speed tracking state
          setSpeedData((prev) => {
            const newReadings = [...prev.speedReadings, currentSpeed].slice(
              -SPEED_WINDOW_SIZE
            );

            const sum = newReadings.reduce((a, b) => a + b, 0);
            const newAvg =
              newReadings.length > 0 ? sum / newReadings.length : 0;

            dispatch(setAvgSpeed(newAvg));

            return {
              currentSpeed,
              avgSpeed: newAvg,
              speedReadings: newReadings,
              lastUpdated: new Date(),
            };
          });
        }
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
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true,
      stopOnStationary: false,
      desiredOdometerAccuracy: 10,
      stationaryRadius: 5,
      // HTTP / SQLite config
      batchSync: false,
      autoSync: true,
    }).then((state) => {
      setEnabled(true);
      console.log(
        "- BackgroundGeolocation is configured and ready: ",
        JSON.stringify(state.enabled)
      );
    });

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  }, [dispatch]);

  /// 3. start / stop BackgroundGeolocation
  useEffect(() => {
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation(null);
      // Reset speed data when stopping
      setSpeedData({
        currentSpeed: 0,
        avgSpeed: 0,
        speedReadings: [],
        lastUpdated: new Date(),
      });
      // Reset Redux store speed
      dispatch(setSpeed(0));
    }
  }, [enabled, dispatch]);

  return {
    location,
    enabled,
    setEnabled,
    speedData,
  };
};
