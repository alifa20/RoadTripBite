type RADIUS_MAP = {
    mode: "walking" | "driving";
    distance: number;
    delta: number;
    zoomLevel: string;
  };
  
  
  export const getRadiusFromSpeed = (speed = 0): RADIUS_MAP => {
    // Walking speed (up to 5 km/h)
    if (speed <= 5) {
      return {
        mode: "walking",
        distance: 10,
        delta: 0.5,
        zoomLevel: "14z",
      }; // 10 km radius for walking (5 km/h * 2 hours)
    }
    // Speeds between 5 km/h and 40 km/h
    else if (speed > 5 && speed <= 40) {
      const distance = Math.ceil(speed * 2); // 2 hours of travel at current speed
      return {
        mode: "walking",
        distance,
        delta: 0.5,
        zoomLevel: "14z",
      };
    }
    // Speeds between 40 km/h and 60 km/h
    else if (speed > 40 && speed <= 60) {
      const distance = 120; // 120 km radius (60 km/h * 2 hours)
      return {
        mode: "driving",
        distance,
        delta: 1.5,
        zoomLevel: "11z",
      };
    }
    // Speeds between 60 km/h and 80 km/h
    else if (speed > 60 && speed <= 80) {
      const distance = 160; // 160 km radius (80 km/h * 2 hours)
      return {
        mode: "driving",
        distance,
        delta: 1.5,
        zoomLevel: "11z",
      };
    }
    // Speeds above 80 km/h
    const distance = 200; // Cap at 200 km radius for very high speeds
    return {
      mode: "driving",
      distance,
      delta: 1.5,
      zoomLevel: "11z",
    };
  };