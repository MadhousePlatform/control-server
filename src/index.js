import fastify from "fastify";
import ws from '@fastify/websocket';
import WebSocketClient from "./websocket.js";
import Logger from './logger.js';
import EventBus from './eventbus.js';
import Auth from './auth.js';

const logger = new Logger();
const eventBus = new EventBus(logger);
const auth = new Auth(logger);

const app = fastify({ logger: true });
app.register(ws);
app.register(async function (fastify) {
    fastify.get('/ws', { websocket: true }, (connection) => {
        new WebSocketClient(connection.socket, eventBus, logger, auth);
    });
});

app.listen({ port: 3000, address: "0.0.0.0" }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`server listening on ${address}`);
});