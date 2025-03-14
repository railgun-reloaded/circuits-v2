import { CircuitInputs, Proof, SnarkJSCircuitInputFormat, VerifyingKey } from './types'
import { numberStringToUint8Array, uint8ArrayToHexString, uint8ArrayToNumberString } from './bytes'
import { SnarkjsProof, VKey } from 'snarkjs'

/**
 * Convert inputs to snarkJS format
 * @param circuitInputs - Circuit inputs to format
 * @returns Formatted snarkJS inputs
 */
export function standardToSnarkJSInput (circuitInputs: CircuitInputs): SnarkJSCircuitInputFormat {
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
export function snarkJSToStandardProof (proof: SnarkjsProof): Proof {
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
 * Convert standard proof to snarkJS format
 * @param proof - Proof inputs to format
 * @returns Formatted snarkJS proof
 */
export function standardToSnarkJSProof (proof: Proof): SnarkjsProof {
  return {
    protocol: 'groth16',
    pi_a: [uint8ArrayToNumberString(proof.a.x), uint8ArrayToNumberString(proof.a.y)],
    pi_b: [
      [uint8ArrayToNumberString(proof.b.x[1]), uint8ArrayToNumberString(proof.b.x[0])],
      [uint8ArrayToNumberString(proof.b.y[1]), uint8ArrayToNumberString(proof.b.x[0])],
    ],
    pi_c: [uint8ArrayToNumberString(proof.c.x), uint8ArrayToNumberString(proof.c.y)]
  }
}

/**
 * Convert standard verifyingKey to snarkJS format
 * @param vkey - VerifyingKey to format
 * @returns Formatted snarkJS verifyingKey
 */
export function standardToSnarkJSVKey (vkey: VerifyingKey): VKey {
  return {
    protocol: 'groth16',
    curve: 'bn128',
    nPublic: vkey.nPublic,
    vk_alpha_1: vkey.vk_alpha_1.map(toString),
    vk_beta_2: vkey.vk_beta_2.map(vkBeta => vkBeta.map(toString)),
    vk_gamma_2: vkey.vk_gamma_2.map(vkGamma => vkGamma.map(toString)),
    vk_delta_2: vkey.vk_delta_2.map(vkDelta => vkDelta.map(toString)),
    vk_alphabeta_12: vkey.vk_alphabeta_12.map(vkAlphaBeta => vkAlphaBeta.map(toString)),
    IC: vkey.IC.map(ic => ic.map(toString)),
  }
}
