# useCounter

Basic counter.

## Usage

```tsx twoslash
import { useCounter } from '@qwikgear/core';

const { counter, inc, dec, set, reset } = useCounter();
```

### With options

```tsx twoslash
import { useCounter } from '@qwikgear/core';

const { counter, inc, dec, set, reset } = useCounter(1, { min: 0, max: 100 });
```
