/**
 * Standard representation of circuit inputs for proof generation
 * These are the parameters required to create a valid RAILGUN transaction proof
 */
type CircuitInputs = {
  /** Current state root of the RAILGUN merkle tree */
  merkleRoot: Uint8Array,
  /** Hash of transaction parameters that bind this transaction to specific conditions */
  boundParamsHash: Uint8Array,
  /** Identifier for the token being transacted */
  token: Uint8Array,
  /** User's RAILGUN public key components */
  publicKey: Uint8Array[],
  /** Transaction signature components */
  signature: Uint8Array[],
  /** Key used for nullification process which prevents double-spending */
  nullifyingKey: Uint8Array,
  /** Notes being spent in this transaction representing the user's balance */
  inputTXOs: {
    /** Unique identifier that prevents double-spending */
    nullifier: Uint8Array,
    /** Random value used in the note */
    randomIn: Uint8Array,
    /** Amount of tokens in the note */
    valueIn: bigint,
    /** Position of this note in the merkle tree */
    merkleleafPosition: number,
    /** Merkle path elements proving note inclusion */
    pathElements: Uint8Array[],
  }[],
  /** Notes being created in this transaction */
  outputTXOs: {
    /** Commitment to the new note being created */
    commitment: Uint8Array,
    /** Recipient's nullifier public key */
    npk: Uint8Array,
    /** Amount of tokens in the new note */
    value: bigint,
  }[],
}

/**
 * SnarkJS representation of circuit inputs
 */
type SnarkJSCircuitInputFormat = {
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
type ProverArtifacts = {
  vkey: {
    protocol: 'groth16',
    curve: 'bn128',
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

/**
 * PublicInputs for verifying, returned by prove()
 * NOTE: PublicInputs is the same as snarkJS.fullProve.PublicSignals
 */
type PublicInputs = {
  /** Proof object for verification */
  proof: Proof;
  // State root when transaction was created
  merkleRoot: Uint8Array;
  /** Identifiers of notes being spent */
  nullifiers: Uint8Array[];
  /** New note commitments being created */
  commitments: Uint8Array[];
  /** Hash of transaction binding parameters */
  boundParams: Uint8Array; // NOTE: Interface used in @railgun-community/contract is not important for circuit interaction
}

/**
 * Proof for verification
 */
type Proof = {
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

export type { CircuitInputs, SnarkJSCircuitInputFormat, ProverArtifacts, PublicInputs, Proof }
