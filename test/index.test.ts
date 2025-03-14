import test from 'brittle'
import { testVectors } from './test-vectors'
import { prove, verify } from '../src/index'

test('Should prove', async function (assert) {
  // Test with each circuit size (ex. 1x2, 2x2 etc.)
  for (const vector of testVectors) {
    assert.execution(await prove(vector.inputs, vector.artifacts))
  }

  assert.pass()
})

test('Should prove and verify, using publicSignals returned from prove', async function (assert) {
  // Test with each circuit size (ex. 1x2, 2x2 etc.)
  for (const vector of testVectors) {
    // Prove the test vectors
    const { proof, publicInputs } = await prove(vector.inputs, vector.artifacts)

    // Verify the proofs
    assert.ok(await verify(vector.artifacts.vkey, publicInputs, proof))
  }

  assert.pass()
})

// @TODO add test for formatting publicInputs/Proof
