# `@railgun-reloaded/circuits-v2`

> Prover / Verifier for Railgun transaction circuit v2

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

## License
[MIT](LICENSE)