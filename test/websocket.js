// TODO implement websocket tests
import test from 'node:test';
import assert from 'node:assert';

import WebSocketClient from '../src/websocket.js';

const nullMethod = () => { };
const mockLogger = { log: nullMethod, error: nullMethod, warn: nullMethod, info: nullMethod };
let mockEventBus;
let mockSocket;

test.beforeEach(() => {
    mockSocket = { on: nullMethod, send: nullMethod, close: nullMethod, removeAllListeners: nullMethod };
    mockEventBus = { subscribe: nullMethod, publish: nullMethod, unsubscribe: nullMethod, removeAllListeners: nullMethod };
});

test.describe('Receiving Message', () => {
    test('Disconnects on messages with invalid JSON content', () => {
        let called = false;
        mockSocket.close = () => { called = true };
        const ws = new WebSocketClient(mockSocket, mockEventBus, mockLogger);
        ws.onMessage('invalid JSON');
        assert.ok(called);
    });

    test('Disconnects on messages with no type', () => {
        let called = false;
        mockSocket.close = () => { called = true };
        const ws = new WebSocketClient(mockSocket, mockEventBus, mockLogger);
        ws.onMessage('{}');
        assert.ok(called);
    });

    test.describe('Handles auth messages', () => {
        test('Informs client of successful auth message', () => {
            let called = false;
            mockSocket.send = (message) => assert.equal(message, '{"type":"auth","success":true}');
            const ws = new WebSocketClient(mockSocket, mockEventBus, mockLogger);
            ws.onMessage('{"type": "auth"}');
        });
        test('Disconnects on multiple auth messages', () => {
            let called = false;
            mockSocket.close = () => { called = true };
            const ws = new WebSocketClient(mockSocket, mockEventBus, mockLogger);
            ws.onMessage('{"type": "auth"}');
            ws.onMessage('{"type": "auth"}');
            assert.ok(called);
        });
    });

    test.describe('Handles subscribe messages', () => {
        test('Disconnects on message before auth', () => {
            let called = false;
            mockSocket.close = () => { called = true };
            const ws = new WebSocketClient(mockSocket, mockEventBus, mockLogger);
            ws.onMessage('{"type": "subscribe"}');
            assert.ok(called);
        });
        test('Subscribes to channels', () => {
            mockEventBus.subscribe = (channels, _callback, id) => {
                assert.deepEqual(channels, ['test']);
                assert.equal(id, ws.subscriberID);
            };

            const ws = new WebSocketClient(mockSocket, mockEventBus, mockLogger);
            ws.onMessage('{"type": "auth"}');
            ws.onMessage('{"type": "subscribe", "channels": ["test"]}');

            mockEventBus.subscribe = nullMethod;
        });
    });

    test.describe('Handles unsubscribe messages', () => {
        test('Disconnects on message before auth', () => {
            let called = false;
            mockSocket.close = () => { called = true };
            const ws = new WebSocketClient(mockSocket, mockEventBus, mockLogger);
            ws.onMessage('{"type": "unsubscribe"}');
            assert.ok(called);
        });
        test('Subscribes to channels', () => {
            mockEventBus.unsubscribe = (channels, id) => {
                assert.deepEqual(channels, ['test']);
                assert.equal(id, ws.subscriberID);
            };

            const ws = new WebSocketClient(mockSocket, mockEventBus, mockLogger);
            ws.onMessage('{"type": "auth"}');
            ws.onMessage('{"type": "unsubscribe", "channels": ["test"]}');

            mockEventBus.subscribe = nullMethod;
        });
    });

    test.describe('Handles other messages', () => {
        test('Disconnects on message before auth', () => {
            let called = false;
            mockSocket.close = () => { called = true };
            const ws = new WebSocketClient(mockSocket, mockEventBus, mockLogger);
            ws.onMessage('{"type": "test_event"}');
            assert.ok(called);
        });
        test('Sends message to eventbus after auth', () => {
            const test_message = '{"type": "test_event", "test_field": true}';
            mockEventBus.publish = (type, data, id) => {
                assert.equal(type, "test_event");
                assert.deepEqual(data, { type: "test_event", test_field: true });
                assert.equal(id, ws.subscriberID);
            };

            const ws = new WebSocketClient(mockSocket, mockEventBus, mockLogger);
            ws.onMessage('{"type": "auth"}');
            ws.onMessage(test_message);

            mockEventBus.publish = nullMethod;
        });
    })
});

test.describe('Closing Connection', () => {
    test('Removes all event listeners on close', () => {
        let called = false;
        mockEventBus.removeAllListeners = (id) => {
            assert.equal(id, ws.subscriberID);
            called = true;
        };

        const ws = new WebSocketClient(mockSocket, mockEventBus, mockLogger);
        ws.onMessage('{"type": "auth"}');
        ws.onClose();

        assert.ok(called);
    });

    test('Removes all socket listeners on close', () => {
        let called = false;
        mockSocket.removeAllListeners = () => { called = true };

        const ws = new WebSocketClient(mockSocket, mockEventBus, mockLogger);
        ws.onClose();

        assert.ok(called);
    });
});