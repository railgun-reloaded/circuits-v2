/**
 * Standard representation of circuit inputs
 */
export type CircuitInputs = {
  merkleRoot: Uint8Array,
  boundParamsHash: Uint8Array,
  token: Uint8Array,
  publicKey: Uint8Array[],
  signature: Uint8Array[],
  nullifyingKey: Uint8Array,
  inputTXOs: {
    nullifier: Uint8Array,
    randomIn: Uint8Array,
    valueIn: bigint,
    merkleleafPosition: number,
    pathElements: Uint8Array[],
  }[],
  outputTXOs: {
    commitment: Uint8Array,
    npk: Uint8Array,
    value: bigint,
  }[],
}

/**
 * SnarkJS representation of circuit inputs
 */
export type SnarkJSCircuitInputFormat = {
  merkleRoot: string,
  boundParamsHash: string,
  nullifiers: string[],
  commitmentsOut: string[],
  token: string,
  publicKey: string[],
  signature: string[],
  randomIn: string[],
  valueIn: string[],
  pathElements: string[][],
  leavesIndices: number[],
  nullifyingKey: string,
  npkOut: string[],
  valueOut: string[]
}

/**
 * Generated circuit artifacts
 */
export type ProverArtifacts = {
  vkey: {
    protocol: string,
    curve: string,
    nPublic: number,
    vk_alpha_1: string[],
    vk_beta_2: string[][],
    vk_gamma_2: string[][],
    vk_delta_2: string[][],
    vk_alphabeta_12: string[][][],
    IC: string[][],
  },
  zkey: Uint8Array,
  wasm: Uint8Array
}

export interface PublicInputs {
  proof: Proof;
  merkleRoot: Uint8Array;
  nullifiers: Uint8Array[];
  commitments: Uint8Array[];
  boundParams: Uint8Array;
}

export type Proof = {
  a: {
    x: Uint8Array;
    y: Uint8Array;
  };
  b: {
    x: [Uint8Array, Uint8Array];
    y: [Uint8Array, Uint8Array];
  };
  c: {
    x: Uint8Array;
    y: Uint8Array;
  };
}

export interface VerifyingKey {
  nPublic: number;
  vk_alpha_1: Uint8Array[];
  vk_beta_2: Uint8Array[][];
  vk_gamma_2: Uint8Array[][];
  vk_delta_2: Uint8Array[][];
  vk_alphabeta_12: Uint8Array[][];
  IC: Uint8Array[][];
}
