/**
 * This contains the event handling system. Since the number of consumers/producers will change over time (more plugins connect/disconnect, etc.), having a centralised location for subscribing to events make sense.
 * 
 * Things to consider - producers shouldn't get their own event back, and consumers should be able to subscribe to multiple events.
 */
class EventBus {
    constructor(logger) {
        this.subscribers = {};
        this.logger = logger;
    }

    subscribe(event, callback, subscriberID) {
        // If event is an array, split it into individual events and call subscribe for each one.
        if (Array.isArray(event)) {
            event.forEach(e => this.subscribe(e, callback, subscriberID));
            return;
        }

        if (!this.subscribers[event]) {
            this.logger.info("Creating new event", event);
            this.subscribers[event] = [];
        }
        this.logger.info("Subscribing to event", event, subscriberID);
        this.subscribers[event].push({ subscriberID, callback });
    }

    unsubscribe(event, subscriberID) {
        if (this.subscribers[event]) {
            this.logger.info("Unsubscribing from event", event, subscriberID);
            this.subscribers[event] = this.subscribers[event].filter(subscriber => subscriber.subscriberID !== subscriberID);
        }
    }

    publish(event, data, subscriberID) {
        this.logger.info("Publishing event", event, subscriberID);
        if (this.subscribers[event]) {
            this.subscribers[event].forEach(callback => {
                // Ensure the producer doesn't get their own event back
                if (callback.subscriberID !== subscriberID) {
                    callback.callback(data);
                }
            });
        }
    }

    removeAllListeners(subscriberID) {
        this.logger.info("Removing all listeners for", subscriberID);
        Object.keys(this.subscribers).forEach(event => this.unsubscribe(event, subscriberID));
    }
}

export default EventBus;