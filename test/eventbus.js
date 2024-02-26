import test from 'node:test';
import assert from 'node:assert';

import EventBus from '../src/eventbus.js';

const nullMethod = () => { };
const mockLogger = { log: nullMethod, error: nullMethod, warn: nullMethod, info: nullMethod };
const eventBus = new EventBus(mockLogger);

test.afterEach(() => {
  eventBus.removeAllListeners('1');
});

test('Can subscribe to and receive an event', () => {
  let called = false;
  eventBus.subscribe('test', () => {
    called = true;
  }, '1');
  eventBus.publish('test', null, '2');
  assert.ok(called);
});

test('Only get events that you subscribe to', () => {
  eventBus.subscribe('test', () => {
    assert.fail('Should not have received this event');
  }, '1');
  eventBus.publish('another-test', null, '2');
});

test('Do not get own events back', () => {
  eventBus.subscribe('test', () => {
    assert.fail('Should not have received this event');
  }, '1');
  eventBus.publish('test', null, { id: '1' });
});

test('Recieve the event that is passed', () => {
  eventBus.subscribe('test', (data) => {
    assert.strictEqual(data, 'test');
  }, '1');
  eventBus.publish('test', 'test', '2');
});

test('Can unsubscribe from an event', () => {
  eventBus.subscribe('test', () => {
    assert.fail('Should not have received this event');
  }, '1');
  eventBus.unsubscribe('test', '1');
  eventBus.publish('test', null, '2');
});
