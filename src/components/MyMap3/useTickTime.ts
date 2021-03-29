import {useEffect, useState} from 'react';

export const useTickTime = () => {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  return {date};
};
