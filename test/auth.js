import test from 'node:test';
import assert from 'node:assert';

import Auth from '../src/auth.js';

test.describe('bad auth', () => {
  test('it returns a fail result on bad auth', () => {
    const auth = new Auth();
    const result = auth.auth('bad_token');
    assert.deepStrictEqual(result, { success: false });
  });

  test('it returns a fail result on empty auth', () => {
    const auth = new Auth();
    const result = auth.auth('');
    assert.deepStrictEqual(result, { success: false });
  });
});

test.describe('good auth', () => {
  test('it returns a success result on good auth', () => {
    const auth = new Auth();
    const result = auth.auth('test1');
    assert.deepStrictEqual(result, { success: true, name: 'test1', id: '1', topics: ['message', 'player_join', 'player_part'] });
  });
  test('it returns a success result on good auth', () => {
    const auth = new Auth();
    const result = auth.auth('test2');
    assert.deepStrictEqual(result, { success: true, name: 'test2', id: '2', topics: ['connected', 'disconnected', 'message', 'player_join', 'player_part'] });
  });
});
