import type { SnarkjsProof } from 'snarkjs'

import { numberStringToUint8Array, uint8ArrayToHexString, uint8ArrayToNumberString } from './bytes'
import type { CircuitInputs, Proof, PublicInputs, SnarkJSCircuitInputFormat } from './types'

/**
 * Convert inputs to snarkJS format
 * @param circuitInputs - Circuit inputs to format
 * @returns Formatted snarkJS inputs
 */
function standardToSnarkJSInput (circuitInputs: CircuitInputs): SnarkJSCircuitInputFormat {
  return {
    merkleRoot: uint8ArrayToHexString(circuitInputs.merkleRoot),
    boundParamsHash: uint8ArrayToHexString(circuitInputs.boundParamsHash),
    nullifiers: circuitInputs.inputTXOs.map(txo => uint8ArrayToHexString(txo.nullifier)),
    commitmentsOut: circuitInputs.outputTXOs.map(txo => uint8ArrayToHexString(txo.commitment)),
    token: uint8ArrayToHexString(circuitInputs.token),
    publicKey: circuitInputs.publicKey.map(uint8ArrayToHexString),
    signature: circuitInputs.signature.map(uint8ArrayToHexString),
    randomIn: circuitInputs.inputTXOs.map(txo => uint8ArrayToHexString(txo.randomIn)),
    valueIn: circuitInputs.inputTXOs.map(txo => txo.valueIn.toString()),
    pathElements: circuitInputs.inputTXOs.map(txo => txo.pathElements.map(uint8ArrayToHexString)),
    leavesIndices: circuitInputs.inputTXOs.map(txo => txo.merkleleafPosition),
    nullifyingKey: uint8ArrayToHexString(circuitInputs.nullifyingKey),
    npkOut: circuitInputs.outputTXOs.map(txo => uint8ArrayToHexString(txo.npk)),
    valueOut: circuitInputs.outputTXOs.map(txo => txo.value.toString()),
  }
}

/**
 * Convert snarkJS proof to standard format
 * @param proof - Proof inputs to format
 * @returns Formatted standard proof
 */
function snarkJSToStandardProof (proof: SnarkjsProof): Proof {
  return {
    a: { x: numberStringToUint8Array(proof.pi_a[0], 32), y: numberStringToUint8Array(proof.pi_a[1], 32) },
    b: {
      x: [numberStringToUint8Array(proof.pi_b[0][1], 32), numberStringToUint8Array(proof.pi_b[0][0], 32)],
      y: [numberStringToUint8Array(proof.pi_b[1][1], 32), numberStringToUint8Array(proof.pi_b[1][0], 32)],
    },
    c: { x: numberStringToUint8Array(proof.pi_c[0], 32), y: numberStringToUint8Array(proof.pi_c[1], 32) },
  }
}

/**
 * Extract PublicInputs from CircuitInputs to be used in verify() after a prove() call
 * @param circuitInputs - CircuitInputs
 * @param proof - Standard Proof
 * @returns Formatted PublicInputs to be used in verify()
 */
function extractPublicInputsFromCircuitInputs (circuitInputs: CircuitInputs, proof: Proof): PublicInputs {
  return {
    proof,
    merkleRoot: circuitInputs.merkleRoot,
    nullifiers: circuitInputs.inputTXOs.map(txo => txo.nullifier),
    commitments: circuitInputs.outputTXOs.map(txo => txo.commitment),
    boundParams: circuitInputs.boundParamsHash
  }
}

/**
 * Convert standard proof to snarkJS format
 * @param proof - Proof inputs to format
 * @returns Formatted snarkJS proof
 */
function standardToSnarkJSProof (proof: Proof): SnarkjsProof {
  return {
    protocol: 'groth16',
    pi_a: [uint8ArrayToNumberString(proof.a.x), uint8ArrayToNumberString(proof.a.y)],
    pi_b: [
      [uint8ArrayToNumberString(proof.b.x[1]), uint8ArrayToNumberString(proof.b.x[0])],
      [uint8ArrayToNumberString(proof.b.y[1]), uint8ArrayToNumberString(proof.b.y[0])],
    ],
    pi_c: [uint8ArrayToNumberString(proof.c.x), uint8ArrayToNumberString(proof.c.y)]
  }
}
/**
 * Convert standard public inputs to snarkJS format
 * @param publicInputs - Public inputs to format
 * @returns - Formatted snarkJS public inputs
 */
function standardToSnarkJSPublicInputs (publicInputs: PublicInputs) : string[] {
  return [
    uint8ArrayToNumberString(publicInputs.merkleRoot),
    uint8ArrayToNumberString(publicInputs.boundParams),
    ...publicInputs.nullifiers.map(uint8ArrayToNumberString),
    ...publicInputs.commitments.map(uint8ArrayToNumberString)
  ]
}

export { standardToSnarkJSInput, snarkJSToStandardProof, extractPublicInputsFromCircuitInputs, standardToSnarkJSProof, standardToSnarkJSPublicInputs }
