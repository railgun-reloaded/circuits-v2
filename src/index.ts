import type { VKey } from 'snarkjs'
import { curves, groth16 } from 'snarkjs'

import { extractPublicInputsFromCircuitInputs, snarkJSToStandardProof, standardToSnarkJSInput, standardToSnarkJSProof, standardToSnarkJSPublicInputs } from './formatter'
import type { CircuitInputs, Proof, ProverArtifacts, PublicInputs } from './types'

/**
 * Create a Railgun transaction proof
 * @param circuitInputs - Circuit inputs for generating proof
 * @param artifacts - Circuit artifacts
 * @returns Proof
 */
async function prove (circuitInputs: CircuitInputs, artifacts: ProverArtifacts): Promise<{ proof: Proof, publicInputs: PublicInputs }> {
  // Format the inputs into snarkJS format
  const snarkJSFormattedInputs = standardToSnarkJSInput(circuitInputs)

  // Generate proof
  const { proof } = await groth16.fullProve(snarkJSFormattedInputs, artifacts.wasm, artifacts.zkey)

  // Standardize the proof
  const standardProof = snarkJSToStandardProof(proof)

  // Extract public inputs
  const snarkJSFormattedPublicInputs = extractPublicInputsFromCircuitInputs(circuitInputs, standardProof)

  // Create snarkJS proof
  const snarkJSFormattedProof = standardToSnarkJSProof(standardProof)

  // Ensure proof passes verification
  groth16.verify(artifacts.vkey, snarkJSFormattedPublicInputs, snarkJSFormattedProof)

  // Format to Uint8Array and return
  return { proof: standardProof, publicInputs: snarkJSFormattedPublicInputs }
}

/**
 * Verify a Railgun transaction proof
 * @param vkey - Circuit verifying key
 * @param publicInputs - Proof public inputs
 * @param proof - Snark proof
 * @returns is proof valid
 */
function verify (vkey: VKey, publicInputs: PublicInputs, proof: Proof): Promise<boolean> {
  // Convert to snarkjs format
  const snarkJSFormattedProof = standardToSnarkJSProof(proof)
  const snarkJSFormattedPublicInputs = standardToSnarkJSPublicInputs(publicInputs)

  // verify and return
  return groth16.verify(vkey, snarkJSFormattedPublicInputs, snarkJSFormattedProof)
}

/**
 * Cleanup snarkJS resources
 * @returns Promise<void>
 *
 * https://github.com/iden3/snarkjs/issues/152
 * https://github.com/iden3/snarkjs/issues/393
 */
async function cleanupSnarkJS (): Promise<void> {
  // Initialize the curve object controlling wasm threads
  const curve = await curves.getCurveFromName('bn128')

  // Terminate threads
  curve.terminate()
}

export type { CircuitInputs, ProverArtifacts, Proof, PublicInputs } from './types'
export { prove, verify, cleanupSnarkJS }
