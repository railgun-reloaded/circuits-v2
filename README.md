# `@railgun-reloaded/circuits-v2`

> Typescript module for generating and verifying the transact proof required by Railgun. 

## Example Usage
```ts
  import {prove, verify} from '@railgun-reloaded/circuits-v2';

  // Generate proof 
  const inputs = {...};
  const artifacts = {...};
  const {proof, publicInputs} = await prove(inputs, artifacts);

  // Verify proof
  await verify(artifacts.vkey, publicInputs, proof);
```

## Install
```sh
npm install @railgun-reloaded/circuits-v2
```

## Usage

If you have the params required to call `prove()`, you also have all of the params required to call `verify()`. 

- `prove()` is a more strongly typed and thorough version of what exists in the contracts repo for [forming a proof to prove on-chain](https://github.com/Railgun-Privacy/contract/blob/612b9687eae8c94d34bf09291ec35f1d8eea1ed2/helpers/logic/prover.ts#L49).
- `verify()` is the typescript version of [proving a proof on-chain](https://github.com/Railgun-Privacy/contract/blob/612b9687eae8c94d34bf09291ec35f1d8eea1ed2/contracts/logic/Verifier.sol#L87)

## Creating new test vectors

To generate inputs for calling `prove()` (other than the existing testVectors in `./test/test-vectors.ts`), refer to the methods used `./test/index.test.ts`
for importing `testVectors`. 

### `circuitInputs` can be retreived from the [contract](https://github.com/Railgun-Privacy/contract) repo through the following steps:

1. Edit [`circuitList` in `artifacts.ts`](https://github.com/Railgun-Privacy/contract/blob/612b9687eae8c94d34bf09291ec35f1d8eea1ed2/helpers/logic/artifacts.ts#L43) to include the circuit(s) you want to generate inputs for

For example, this will generate circuits for 1x2 and 2x2: 

```
const circuitList = [
  {
    nullifiers: 1,
    commitments: 2,
  },
  {
    nullifiers: 2,
    commitments: 2,
  },
];
```

2. In [`transaction.ts`](https://github.com/Railgun-Privacy/contract/blob/612b9687eae8c94d34bf09291ec35f1d8eea1ed2/helpers/logic/transaction.ts#L543), 
right after the call to `prove()`, add some logs to print the inputs needed for forming new test vectors. 

For example, this will log `circuitInputs` for `prove()`:

```
console.log('\ninputs: ', JSON.stringify(inputs, (_, v: unknown) => {
  if (typeof v === 'bigint') return [...bigIntToArray(v, 32)];
  if (v instanceof Uint8Array) return [...v];
  try {
  if (typeof v == 'string') return bigIntToArray(BigInt(v), 32);
  } catch (e) {}
  return v;
}));
```

3. Run a test that triggers the logging of inputs in step 2. 

For example, in [`verifier.ts`](https://github.com/Railgun-Privacy/contract/blob/612b9687eae8c94d34bf09291ec35f1d8eea1ed2/test/logic/verifier.ts#L178), 
we can add a `.only` to get the inputs we need:

```
it.only('Should verify proofs', async function () {
```

Followed by 

```
yarn test
```

4. Format the retreived test vectors. 

See `testVectors` in `./test/test-vectors.ts` for the necessary `inputs` reformatting using `new Uint8Array()`. 


### `artifacts` can be retreived from the [IPFS host](https://ipfs.io/ipfs/QmeBrG7pii1qTqsn7rusvDiqXopHPjCT9gR4PsmW7wXqZq/) for different circuit sizes. 

1. Choose a circuit size and download the `vkey.json` and `zkey` for a `ProverArtifacts` object, found in `./src/types.ts`. 

For example, `1x1`

2. Download the relating `.wasm` file found in the [`prover/snarkjs`](https://ipfs.io/ipfs/QmeBrG7pii1qTqsn7rusvDiqXopHPjCT9gR4PsmW7wXqZq/prover/snarkjs/) folder. 

For example, `1x1.wasm`

3. Paste the chosen circuits' `vkey.json`, `zkey`, and `.wasm` file in the `./test/test-artifacts` folder. 

4. Create the new `testVectors` object in `./test/test-vectors.ts`

5. Run a test on `prove()` that will return the generated `Proof` and `publicInputs` values. 

For example, in `./test/index.test.ts`:

```
test.only('Should prove',
```

6. Copy the `proof` value from the test output and paste them into the `testVectors` object in `./test/test-vectors.ts`

You now have newly generated test vectors for the chosen circuit size. 

## License
[MIT](LICENSE)