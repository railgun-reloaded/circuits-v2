import test from 'brittle'
import { testVectors } from './test-vectors'
import { prove } from '../src/index'

test('Should prove', async function (assert) {
  // Test 1x2
  for (const vector of testVectors) {
    assert.execution(await prove(vector.inputs, vector.artifacts))
  }

  assert.pass()
})

test('Should verify', function (assert) {
  // Test 1x2
  assert.pass()
})
