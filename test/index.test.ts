import { hook, test } from 'brittle'

import { extractPublicInputsFromCircuitInputs, snarkJSToStandardProof, standardToSnarkJSInput, standardToSnarkJSProof, standardToSnarkJSPublicInputs } from '../src/formatter'
import { cleanupSnarkJS, prove, verify } from '../src/index'

import { snarkJsCircuitInputs, snarkJsProofs, snarkJsPublicInputs, standardProofs, standardPublicInputs, testVectors } from './test-vectors'

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

test('Should ensure formatting is correct for SnarkjsProof', async function (assert) {
  // For each circuit
  snarkJsProofs.forEach((snarkJsProof, i) => {
    // Format a snarkJs proof to standard format
    const returnedStandardProof = snarkJSToStandardProof(snarkJsProof)

    // Ensure the formatted proof is corrects
    assert.alike(returnedStandardProof, standardProofs[i])
  })
})

test('Should ensure formatting is correct for Proof', async function (assert) {
  // For each circuit
  standardProofs.forEach((standardProof, i) => {
  // Format a standard proof to snarkJs format
    const returnedSnarkJsProof = standardToSnarkJSProof(standardProof)

    // Ensure the formatted proof is correct
    assert.alike(returnedSnarkJsProof, snarkJsProofs[i])
  })
})

test('Should ensure formatting is correct for CircuitInputs', async function (assert) {
  // For each test vector
  testVectors.forEach((testVector, i) => {
    // Format a standard CircuitInputs to snarkJs format
    const returnedSnarkJsCircuitInputs = standardToSnarkJSInput(testVector.inputs)

    // Ensure the formatted CircuitInputs is correct
    assert.alike(returnedSnarkJsCircuitInputs, snarkJsCircuitInputs[i])
  })
})

test('Should ensure formatting is correct for PublicInputs', async function (assert) {
  // standardToSnarkJSPublicInputs
  standardPublicInputs.forEach((standardPublicInput, i) => {
    // Format a standard PublicInputs to snarkJs format
    const returnedStringArray = standardToSnarkJSPublicInputs(standardPublicInput)

    assert.alike(returnedStringArray, snarkJsPublicInputs[i])
  })
})

test('Should ensure formatting is correct for extracted PublicInputs', async function (assert) {
  // For each circuit
  testVectors.forEach((testVector, i) => {
    // Extract PublicInputs from existing CircuitInputs
    const returnedPublicInputs = extractPublicInputsFromCircuitInputs(testVector.inputs, testVector.proof)

    // Ensure the formatted public inputs are correct
    assert.alike(returnedPublicInputs, standardPublicInputs[i])
  })
})

hook('Cleanup snarkJS', async function () {
  // Cleanup snarkJS curve that snarkJS leaves open from ffjavascript by default
  await cleanupSnarkJS()
})
