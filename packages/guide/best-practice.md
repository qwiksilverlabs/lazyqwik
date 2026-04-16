# Best Practice

### Destructuring

Most of hooks return an **object of signals** that you can use [ES6's object destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) syntax on to take what you need. For example:

```tsx
import { useToggle } from '@lazyqwik/core';

const [state, toggle] = useToggle();

console.log(state);
```
