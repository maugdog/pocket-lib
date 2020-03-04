import { useEffect } from 'react';
import { createBrowserHistory } from 'history';
import tracker from 'src/tracker';

/**
  * A convenient hook for connecting your app to the tracking API. Handles tracker initialization, route listening,
  * initial page load tracking, and cleanup.
  *
  * @param {boolean} blacklisted - A truthy/falsey value indicating whether the current environment/client should be tracked.
  * @param {function} sendToCustomService - A function that takes an array of tracking event objects of the form { name, data }
  * as its only parameter, and returns a promise that either resolves on successful transmission of the data, or rejects on failure.
  * @param {boolean} debug - A truthy value will enable logging during tradcking events.
  */
export const useTracking = (blacklisted, sendToCustomService, debug) => {
  useEffect(() => {
    const history = createBrowserHistory();
    tracker.debug = debug;
    tracker.blacklisted = blacklisted;
    tracker.sendToCustomService = sendToCustomService;

    // Track the initial page load
    tracker.page(history.location.pathname);

    // Listen for route changes
    const unlisten = history.listen(location => tracker.page(location.pathname));

    // Cleanup when the App unmounts...
    return () => {
      tracker.stop();
      unlisten();
    };
  }, []);
};

export default useTracking;
