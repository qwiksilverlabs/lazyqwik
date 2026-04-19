# useGSAP

GSAP support for Qwik. `useGSAP$()` is a drop-in replacement for `useVisibleTask$()` that automatically handles cleanup using `gsap.context()`.

## Usage

```tsx
import { $, component$ } from '@builder.io/qwik';
import gsap from 'gsap';
import { useGSAP$ } from '@qwikgear/gsap';

export default component$(() => {
  useGSAP$(() => {
    gsap.to('#blue-box', { x: 300, yoyo: true, repeat: -1 });
  });

  return (
    <div>
      <div id="blue-box" style={{ width: '200px', height: '200px', backgroundColor: 'blue' }}></div>
    </div>
  );
});
```
