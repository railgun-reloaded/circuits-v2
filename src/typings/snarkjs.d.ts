declare module 'snarkjs' {
  interface SnarkjsProof {
    pi_a: [string, string];
    pi_b: [[string, string], [string, string]];
    pi_c: [string, string];
    protocol: 'groth16';
  }

  interface SNARK {
    proof: SnarkjsProof;
    publicSignals: PublicSignals;
  }

  interface VKey {
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
      wtnsCalcOptions?: any,
      proverOptions?: { singleThread?: boolean },
    ): Promise<SNARK>
    declare function verify (
      vkVerifier: VKey,
      publicSignals: unknown,
      proof: SnarkjsProof,
      logger?: unknown,
    ): Promise<boolean>
  }

  interface Curve {
    terminate: () => Promise<void>;
  }

  namespace curves {
    declare function getCurveFromName (name: string, options?: CurveOptions): Promise<Curve>
  }

  type Curves = 'bn128'

  export type { SnarkjsProof, SNARK, VKey, Curves }
  export { groth16, curves }
}
