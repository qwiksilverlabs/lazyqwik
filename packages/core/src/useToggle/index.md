# `useToggle`

A boolean switcher with utility functions.

## Usage

```tsx
import { useToggle } from '@qwikgear/core';

export default component$(() => {
  const [value, toggle] = useToggle(false);

  return <button onClick$={toggle}>{value ? 'ON' : 'OFF'}</button>;
});
```
