import { createDOM } from '@builder.io/qwik/testing';
import { it, expect, describe } from 'vite-plus/test';
import { useCounter } from '.';
import { component$ } from '@builder.io/qwik';

const UseCounterTestComponent = component$<{ initial?: number; min?: number; max?: number }>(
	({ initial, min, max }) => {
		const { counter, inc, dec, set, reset } = useCounter(initial, { min, max });
		return (
			<div>
				<p id="value">{String(counter.value)}</p>
				<button id="inc-btn" onClick$={() => inc()}>
					Inc
				</button>
				<button id="dec-btn" onClick$={() => dec()}>
					Dec
				</button>
				<button id="inc5-btn" onClick$={() => inc(5)}>
					Inc5
				</button>
				<button id="dec5-btn" onClick$={() => dec(5)}>
					Dec5
				</button>
				<button id="set10-btn" onClick$={() => set(10)}>
					Set10
				</button>
				<button id="reset-btn" onClick$={() => reset()}>
					Reset
				</button>
				<button id="reset5-btn" onClick$={() => reset(5)}>
					Reset5
				</button>
			</div>
		);
	},
);

const UseCounterInspectComponent = component$(() => {
	const result = useCounter();
	return (
		<div>
			<p id="counter-type">{typeof result.counter.value}</p>
			<p id="inc-type">{typeof result.inc}</p>
			<p id="dec-type">{typeof result.dec}</p>
			<p id="set-type">{typeof result.set}</p>
			<p id="reset-type">{typeof result.reset}</p>
		</div>
	);
});

const getText = (screen: ParentNode, id: string) =>
	(screen.querySelector(`#${id}`) as HTMLElement).textContent;

describe('useCounter', () => {
	describe('return shape', () => {
		it('should return counter as a number', async () => {
			const { render, screen } = await createDOM();
			await render(<UseCounterInspectComponent />);
			expect(getText(screen, 'counter-type')).toBe('number');
		});

		it('should return inc as a function', async () => {
			const { render, screen } = await createDOM();
			await render(<UseCounterInspectComponent />);
			expect(getText(screen, 'inc-type')).toBe('function');
		});

		it('should return dec as a function', async () => {
			const { render, screen } = await createDOM();
			await render(<UseCounterInspectComponent />);
			expect(getText(screen, 'dec-type')).toBe('function');
		});

		it('should return set as a function', async () => {
			const { render, screen } = await createDOM();
			await render(<UseCounterInspectComponent />);
			expect(getText(screen, 'set-type')).toBe('function');
		});

		it('should return reset as a function', async () => {
			const { render, screen } = await createDOM();
			await render(<UseCounterInspectComponent />);
			expect(getText(screen, 'reset-type')).toBe('function');
		});
	});

	describe('initial value', () => {
		it('should default to 0 when no initial value is provided', async () => {
			const { render, screen } = await createDOM();
			await render(<UseCounterTestComponent />);
			expect(getText(screen, 'value')).toBe('0');
		});

		it('should use provided initial value', async () => {
			const { render, screen } = await createDOM();
			await render(<UseCounterTestComponent initial={10} />);
			expect(getText(screen, 'value')).toBe('10');
		});
	});

	describe('inc behaviour', () => {
		it('should increment by 1 by default', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseCounterTestComponent initial={0} />);
			expect(getText(screen, 'value')).toBe('0');

			await userEvent('#inc-btn', 'click');
			expect(getText(screen, 'value')).toBe('1');
		});

		it('should increment by custom delta', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseCounterTestComponent initial={0} />);

			await userEvent('#inc5-btn', 'click');
			expect(getText(screen, 'value')).toBe('5');
		});

		it('should handle multiple increments', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseCounterTestComponent initial={0} />);

			const expected = ['1', '2', '3'];
			for (const val of expected) {
				await userEvent('#inc-btn', 'click');
				expect(getText(screen, 'value')).toBe(val);
			}
		});
	});

	describe('dec behaviour', () => {
		it('should decrement by 1 by default', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseCounterTestComponent initial={5} />);
			expect(getText(screen, 'value')).toBe('5');

			await userEvent('#dec-btn', 'click');
			expect(getText(screen, 'value')).toBe('4');
		});

		it('should decrement by custom delta', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseCounterTestComponent initial={10} />);

			await userEvent('#dec5-btn', 'click');
			expect(getText(screen, 'value')).toBe('5');
		});
	});

	describe('set behaviour', () => {
		it('should set counter to a specific value', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseCounterTestComponent initial={0} />);

			await userEvent('#set10-btn', 'click');
			expect(getText(screen, 'value')).toBe('10');
		});
	});

	describe('reset behaviour', () => {
		it('should reset to initial value', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseCounterTestComponent initial={3} />);

			await userEvent('#inc-btn', 'click');
			expect(getText(screen, 'value')).toBe('4');

			await userEvent('#reset-btn', 'click');
			expect(getText(screen, 'value')).toBe('3');
		});

		it('should reset to a provided value', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseCounterTestComponent initial={0} />);

			await userEvent('#inc-btn', 'click');
			expect(getText(screen, 'value')).toBe('1');

			await userEvent('#reset5-btn', 'click');
			expect(getText(screen, 'value')).toBe('5');
		});
	});

	describe('min/max constraints', () => {
		it('should not increment beyond max', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseCounterTestComponent initial={9} max={10} />);

			await userEvent('#inc-btn', 'click');
			expect(getText(screen, 'value')).toBe('10');

			await userEvent('#inc-btn', 'click');
			expect(getText(screen, 'value')).toBe('10');
		});

		it('should not decrement below min', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseCounterTestComponent initial={1} min={0} />);

			await userEvent('#dec-btn', 'click');
			expect(getText(screen, 'value')).toBe('0');

			await userEvent('#dec-btn', 'click');
			expect(getText(screen, 'value')).toBe('0');
		});

		it('should clamp set value to max', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseCounterTestComponent initial={0} max={5} />);

			await userEvent('#set10-btn', 'click');
			expect(getText(screen, 'value')).toBe('5');
		});

		it('should clamp set value to min', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseCounterTestComponent initial={5} min={3} />);

			await userEvent('#dec5-btn', 'click');
			expect(getText(screen, 'value')).toBe('3');
		});
	});
});
