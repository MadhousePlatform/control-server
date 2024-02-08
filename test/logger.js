import { mock, test } from 'node:test';
import assert from 'node:assert';

import logger from '../src/logger.js';

const my_logger = new logger();

test.describe('log', () => {
    test('Can log a message', () => {
        const original_logger = console.log;
        console.log = mock.fn((...message) => { assert.equal(message[0], 'Test log message') });
        my_logger.log('Test log message');
        console.log = original_logger;
    });

    test('Can log multiple messages', () => {
        const original_logger = console.log;
        console.log = mock.fn((...message) => { assert.deepEqual(message, ['Test log message', 'log another']) });
        my_logger.log('Test log message', 'log another');
        console.log = original_logger;
    });
});

test.describe('warn', () => {
    test('Can log a warning', () => {
        const original_logger = console.warn;
        console.warn = mock.fn((...message) => { assert.equal(message[0], 'Test warn message') });
        my_logger.warn('Test warn message');
        console.warn = original_logger;
    });

    test('Can warn multiple messages', () => {
        const original_logger = console.warn;
        console.warn = mock.fn((...message) => { assert.deepEqual(message, ['Test warn message', 'warn another']) });
        my_logger.warn('Test warn message', 'warn another');
        console.warn = original_logger;
    });
});

test.describe('error', () => {
    test('Can log a error', () => {
        const original_logger = console.error;
        console.error = mock.fn((...message) => { assert.equal(message[0], 'Test error message') });
        my_logger.error('Test error message');
        console.error = original_logger;
    });

    test('Can error multiple messages', () => {
        const original_logger = console.error;
        console.error = mock.fn((...message) => { assert.deepEqual(message, ['Test error message', 'error another']) });
        my_logger.error('Test error message', 'error another');
        console.error = original_logger;
    });
});

test.describe('info', () => {
    test('Can log a info', () => {
        const original_logger = console.info;
        console.info = mock.fn((...message) => { assert.equal(message[0], 'Test info message') });
        my_logger.info('Test info message');
        console.info = original_logger;
    });

    test('Can info multiple messages', () => {
        const original_logger = console.info;
        console.info = mock.fn((...message) => { assert.deepEqual(message, ['Test info message', 'info another']) });
        my_logger.info('Test info message', 'info another');
        console.info = original_logger;
    });
});
