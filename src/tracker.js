/**
  * Tracker class used to wrap tracking calls for third-party analytics platforms and custom tracking services. The module
  * exports a singleton instance of the Tracker class.
  *
  * When your app launches, you should immediately set the `tracker.blacklisted` property to `true` or `false` depending on
  * whether or not you want to track events for the current environment. This determination is yours to make. E.g. you
  * may want to set `tracker.blacklisted = true;` if the current runtime environment is a server-side render of a web app, the
  * requesting client is a bot, or the client is not yet authenticated. Blacklisted clients will not trigger tracking events
  * for _either_ custom tracking services, or third party services.
  *
  * If you are using a custom tracking service, then you will need to call `tracker.start();` to start processing the event
  * queue. After calling the `start()` method, the `Tracker` instance will begin polling your service every `tracker.interval`
  * milliseconds via `tracker.sendToCustomService(batch)`. `sendToCustomService` should return a Promise that resolves on
  * successful requests to your service and rejects on failure. The `batch` parameter that is passed to the `sendToCustomService`
  * is an array of queued events to be processed by your service. Each batch element is an object of the form `{ name, data }`.
  */
export class Tracker {
  constructor(options) {
    this.debug = false;
    this.queue = [];
    this.timeout = null;
    this.syncInterval = 1000;
    this.isSyncing = false;
    this.sendToCustomService = options && options.sendToCustomService;
    this.interval = null;
    this.blacklisted = (options && options.blacklisted) || false;

    this.sync = this.sync.bind(this);
  }

  /**
    * Used internally for logging in debug environments
    */
  logMessage(message, ...data) {
    if(this.debug) { console.log(message, ...data); }
  }

  /**
    * Starts the automatic syncing interval.
    */
  start() {
    this.interval = setInterval(this.sync, this.syncInterval);
  }

  /**
    * Stops the automatic syncing interval.
    */
  stop() {
    if(this.interval) { clearInterval(this.interval); }
  }

  /**
    * Attempts to send the provided batch of tracking events to the custom service (likely your own API server).
    *
    * @param {array} batch - An array of tracking events to send to the server.
    * @param {function} callback - The callback function to execute when done.
    */
  send(batch, callback) {
    if(this.sendToCustomService && !this.blacklisted) {
      this.isSyncing = true;

      this.logMessage('Tracker is sending batch:', batch);
      this.sendToCustomService(batch)
        .then(result => {
          this.isSyncing = false;
          if(callback) { callback(); }
        })
        .catch(err => {
          this.isSyncing = false;
          if(callback) { callback(err); }
        });
    } else {
      this.logMessage(`Tracker is blacklisted`);
    }
  }

  /**
    * Sends the batch of tracking events that have been queued up in `this.queue` to the server.
    */
  sync() {
    if(!this.isSyncing && this.queue.length) {
      const batch = this.queue;
      this.queue = [];

      this.send(batch, err => {
        if(err) { this.queue = this.queue.concat(batch); }
      });
    }
  }

  /**
  * Used by certain third party analytics providers to identiy the user. The `user` parameter should, at the very least, contain an `id` property.
  *
  * @param {object} user - An object containing information about the user being identified.
  */
  identify(user) {
    if(user && user.id && !this.blacklisted) {
      if(typeof mixpanel !== 'undefined') { mixpanel.identify(user.id); }
      this.logMessage(`Tracking identification: ${user.id}`);
    }
  }

  /**
    * Tracking function for pushing a tracking event into the tracking queue. Tracking events are composed of
    * an event name, and optional data component. Events are pushed into queue that is synced to the remote server
    * with a set frequency.
    *
    * @param {string} name - The name of the event.
    * @param {object} data - Optional data object to be submitted with the event.
    */
  track(name, data) {
    if(!this.blacklisted) {
      this.queue.push({ name, data });

      if(typeof ga !== 'undefined') { ga('send', 'event', 'Site', name); }
      if(typeof mixpanel !== 'undefined') { mixpanel.track(name, data); }
      this.logMessage(`Tracking event: "${name}" with data: `, data);
    }
  }

  /**
    * For tracking page events. Simply pushes a `$page` event and the url as a data parameter onto the queue.
    *
    * @param {string} url - The page url to track.
    */
  page(url) {
    if(!this.blacklisted) {
      this.queue.push({ name: '$page', data: { url } });

      if(typeof ga !== 'undefined') {

        ga('set', 'page', url);
        ga('send', 'pageview');
      }

      if(typeof mixpanel !== 'undefined') { mixpanel.track('Page View', { url }); }
      this.logMessage(`Tracking "$page" event: ${url}`);
    }
  }
}

// Singleton instance used for tracking events on the client
export const tracker = new Tracker();

export default tracker;
