declare module 'snarkjs' {
  export interface SnarkjsProof {
    pi_a: [string, string];
    pi_b: [[string, string], [string, string]];
    pi_c: [string, string];
    protocol: 'groth16';
  }

  export interface SNARK {
    proof: SnarkjsProof;
    publicSignals: PublicSignals;
  }

  export interface VKey {
    protocol: 'groth16';
    curve: Curves;
    nPublic: number;
    vk_alpha_1: (string | bigint)[];
    vk_beta_2: (string | bigint)[][];
    vk_gamma_2: (string | bigint)[][];
    vk_delta_2: (string | bigint)[][];
    vk_alphabeta_12: (string | bigint)[][][];
    IC: (string | bigint)[][];
  }

  namespace groth16 {
    declare function fullProve (
      inputs: unknown,
      wasm: Uint8Array,
      zkey: Uint8Array,
      logger?: unknown,
    ): Promise<SNARK>
    declare function verify (
      vkVerifier: VKey,
      publicSignals: unknown,
      proof: SnarkjsProof,
      logger?: unknown,
    ): Promise<boolean>
  }

  export interface Curve {
    terminate: () => Promise<void>;
  }

  namespace curves {
    declare function getCurveFromName (name: string, options?: CurveOptions): Promise<Curve>
  }

  export type Curves = 'bn128'
}
