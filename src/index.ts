import { groth16 } from 'snarkjs'
import { snarkJSToStandardProof, standardToSnarkJSInput, standardToSnarkJSProof, standardToSnarkJSVKey } from './formatter'
import { CircuitInputs, ProverArtifacts, Proof, VerifyingKey, PublicInputs } from './types'

export type { CircuitInputs, ProverArtifacts, Proof, VerifyingKey, PublicInputs } from './types'
/**
 * Create a Railgun transaction proof
 * @param circuitInputs - Circuit inputs for generating proof
 * @param artifacts - Circuit artifacts
 * @returns Proof
 */
export async function prove (circuitInputs: CircuitInputs, artifacts: ProverArtifacts): Promise<Proof> {
  // Format the inputs into snarkJS format
  const snarkJSFormattedInputs = standardToSnarkJSInput(circuitInputs)

  // Generate proof
  // @TODO also return public inputs
  const { proof } = await groth16.fullProve(snarkJSFormattedInputs, artifacts.wasm, artifacts.zkey)

  // Format to Uint8Array and return
  return snarkJSToStandardProof(proof)
}

/**
 * Verify a Railgun transaction proof
 * @param vkey - Circuit verifying key
 * @param publicInputs - Proof public inputs
 * @param proof - Snark proof
 * @returns is proof valid
 */
export function verify (vkey: VerifyingKey, publicInputs: PublicInputs, proof: Proof) {
  // Convert to snarkjs format
  const snarkJSFormattedVkey = standardToSnarkJSVKey(vkey)
  const snarkJSFormattedProof = standardToSnarkJSProof(proof)

  // verify and return
  return groth16.verify(snarkJSFormattedVkey, publicInputs, snarkJSFormattedProof)
}
