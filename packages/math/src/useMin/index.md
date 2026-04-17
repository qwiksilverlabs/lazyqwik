# useMin

Reactive `Math.min`.

## Usage

```ts
import { useMin } from '@qwikgear/math';

const a = useSignal(1);
const b = useSignal(2);

const c = useMax(a, b); // Signal<1>
```
