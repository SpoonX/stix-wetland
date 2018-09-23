# stix-wetland

A [stix](https://github.com/SpoonX/stix) module for [Wetland ORM](https://wetland.spoonx.org/).

## Setup

If you initialized a new stix project using the [boards cli stix preset](https://github.com/SpoonX/boards-preset-stix), stix-gates will already be included in your project and you can move on to the [using section](#using). If not, keep reading.

1. In your stix project, simply run `yarn add stix-wetland`.
2. Add the module to your project's `src/config/modules.ts`:

```ts
import { ModuleManagerConfigInterface } from 'stix';
import { Wetland } from 'stix-wetland';

export const modules: ModuleManagerConfigInterface = [
  Wetland,
  // Your other modules.
];
```

### Setting up wetland

[TBD]

## License

MIT.
