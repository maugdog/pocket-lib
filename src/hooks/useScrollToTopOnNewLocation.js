import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
  * A convenient hook for having your React Router based app scroll to the top of the page automatically on page navigation
  */
export const useScrollToTopOnNewLocation = () => {
  const { pathname } = useLocation();
  const [lastLocationPath, setLastLocationPath] = useState(pathname);

  useEffect(() => {
    if(lastLocationPath !== pathname) {
      if(window) { window.scrollTo(0, 0); }
      setLastLocationPath(pathname);
    }
  }, [pathname]);
};

export default useScrollToTopOnNewLocation;
