const { useState, useEffect } = require("react");

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const updateStatus = () => setIsOnline(navigator.onLine);

    updateStatus();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

export default useOnlineStatus;
