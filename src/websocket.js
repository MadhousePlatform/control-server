/**
 * This file contains the handlers for websocket connections. This includes the authentication and the encoding/decoding and routing of messages.
 */
class WebSocketClient {
    constructor(socket, eventBus, logger) {
        this.socket = socket;
        this.eventBus = eventBus;
        this.authenticated = false;
        this.logger = logger;

        this.socket.on('message', this.onMessage.bind(this));
        this.socket.on('close', this.onClose.bind(this));
    }

    onMessage(message) {
        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            this.logger.warn('Error parsing message:', error);
            this.socket.close();
            return;
        }

        // We need to ensure the data has a type
        if (!data.type) {
            this.logger.warn('Invalid message received (no type)', data);
            this.socket.close();
            return;
        }

        // We only handle auth messages if we're not authenticated, and data messages if we are. In all other cases, we assume the client is a bad actor and close the connection.
        if (!this.authenticated && data.type === 'auth') {
            this.onAuth(data);
        } else if (this.authenticated && data.type === 'subscribe') {
            this.onSubscribe(data);
        } else if (this.authenticated && data.type != 'auth') {
            this.onData(data);
        } else {
            this.logger.warn('Invalid message received (unauthenticated and non-authentication message)', data);
            this.socket.close();
        }
    }

    onAuth(data) {
        // TODO Implement authentication
        this.authenticated = true;
        this.id = Math.random().toString(36); // This should come from authentication service. Using something random for now.
        this.name = Math.random().toString(36); // This should come from authentication service. Using something random for now

        this.socket.send(JSON.stringify({ type: 'auth', success: true }));
        this.eventBus.publish('connected', { type: 'connected', service: this }, this);
    }

    onSubscribe(data) {
        this.eventBus.subscribe(data.channels, this.onEvent.bind(this), this.id);
    }

    onUnsubscribe(data) {
        this.eventBus.unsubscribe(data.channels, this.id);
    }

    onEvent(event, publisher) {
        this.socket.send(JSON.stringify(event));
    }

    onData(data) {
        this.eventBus.publish(data.type, data, this);
    }

    onClose() {
        this.logger.log('Connection closed');

        // Remove all listeners for this client
        this.socket.removeAllListeners();
        this.eventBus.removeAllListeners(this.id);

        this.eventBus.publish('disconnected', { type: 'disconnected', service: this }, this);
    }
}

export default WebSocketClient;
