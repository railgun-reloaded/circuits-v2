import test from 'brittle'
import { snarkJsProofs, standardProofs, testVectors } from './test-vectors'
import { prove, verify } from '../src/index'
import { snarkJSToStandardProof, standardToSnarkJSProof } from '../src/formatter'

test('Should prove', async function (assert) {
  // Test with each circuit size (ex. 1x2, 2x2 etc.)
  for (const vector of testVectors) {
    // Prove the inputs, which will throw an error if it fails
    assert.execution(await prove(vector.inputs, vector.artifacts), `Circuit Size ${vector.inputs.inputTXOs.length}x${vector.inputs.outputTXOs.length}`)
  }
})

test('Should prove and verify, using publicSignals returned from prove', async function (assert) {
  // Test with each circuit size (ex. 1x2, 2x2 etc.)
  for (const vector of testVectors) {
    // Prove the test vectors
    const { proof, publicInputs } = await prove(vector.inputs, vector.artifacts)

    // Verify the proofs, which returns a boolean
    assert.ok(await verify(vector.artifacts.vkey, publicInputs, proof), `Circuit Size ${vector.inputs.inputTXOs.length}x${vector.inputs.outputTXOs.length}`)
  }
})

test.solo('Should ensure formatting is correct for SnarkjsProof', async function (assert) {
  // For each circuit
  for (const snarkJsProof of snarkJsProofs) {
    // Format a snarkJs proof to standard format
    const returnedStandardProof = snarkJSToStandardProof(snarkJsProof)

    // Ensure the formatted proof is correct
    assert.alike(returnedStandardProof, snarkJsProof)
  }
})

test('Should ensure formatting is correct for Proof', async function (assert) {
  // For each circuit
  for (const standardProof of standardProofs) {
  // Format a standard proof to snarkJs format
    const returnedSnarkJsProof = standardToSnarkJSProof(standardProof)

    // Ensure the formatted proof is correct
    assert.alike(returnedSnarkJsProof, standardProof)
  }
})

// test('Should ensure formatting is correct for PublicInputs', async function (assert) {
//   // todo test standardToSnarkJSPublicInputs

// })

// test('Should ensure formatting is correct for CircuitInputs', async function (assert) {
//   // todo test extractPublicInputsFromCircuitInputs
// })

// test('Should ensure formatting is correct for SnarkjsInput', async function (assert) {
//   // todo test standardToSnarkJSInput
// })
