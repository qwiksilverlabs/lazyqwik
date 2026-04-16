import { createDOM } from '@builder.io/qwik/testing';
import { it, expect, describe } from 'vite-plus/test';
import { useClamp } from '.';
import { component$, useSignal } from '@builder.io/qwik';

interface UseClampTestProps {
	initial: number;
	min: number;
	max: number;
}

const UseClampTestComponent = component$<UseClampTestProps>(({ initial, min, max }) => {
	const current = useSignal(initial);
	const result = useClamp(current, min, max);

	return (
		<div>
			<p id="result-text">{result.value}</p>
			<button id="set-above-max" onClick$={() => (current.value = max + 1)}>
				Exceed Max
			</button>
			<button id="set-below-min" onClick$={() => (current.value = min - 1)}>
				Exceed Min
			</button>
			<button id="set-max" onClick$={() => (current.value = max)}>
				Set Max
			</button>
			<button id="set-min" onClick$={() => (current.value = min)}>
				Set Min
			</button>
			<button id="set-zero" onClick$={() => (current.value = 0)}>
				Set Zero
			</button>
		</div>
	);
});

const getResultText = (screen: ParentNode) =>
	(screen.querySelector('#result-text') as HTMLElement).textContent;

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 100;

const renderDefault = async (initial = 50) => {
	const { render, screen, userEvent } = await createDOM();
	await render(<UseClampTestComponent initial={initial} min={DEFAULT_MIN} max={DEFAULT_MAX} />);
	return { screen, userEvent };
};

describe('useClamp', () => {
	describe('initial render', () => {
		it('should return value unchanged when within range', async () => {
			const { screen } = await renderDefault(50);
			expect(getResultText(screen)).toBe('50');
		});

		it('should clamp to max when initial value exceeds max', async () => {
			const { screen } = await renderDefault(200);
			expect(getResultText(screen)).toBe('100');
		});

		it('should clamp to min when initial value is below min', async () => {
			const { screen } = await renderDefault(-10);
			expect(getResultText(screen)).toBe('1');
		});

		it('should return max when initial value equals max', async () => {
			const { screen } = await renderDefault(100);
			expect(getResultText(screen)).toBe('100');
		});

		it('should return min when initial value equals min', async () => {
			const { screen } = await renderDefault(1);
			expect(getResultText(screen)).toBe('1');
		});
	});

	describe('boundary clamping', () => {
		it('should clamp to max when signal exceeds upper bound', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-above-max', 'click');
			expect(getResultText(screen)).toBe('100');
		});

		it('should clamp to min when signal goes below lower bound', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-below-min', 'click');
			expect(getResultText(screen)).toBe('1');
		});

		it('should return exact max when signal equals max', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-max', 'click');
			expect(getResultText(screen)).toBe('100');
		});

		it('should return exact min when signal equals min', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-min', 'click');
			expect(getResultText(screen)).toBe('1');
		});
	});

	describe('reactivity', () => {
		it('should update reactively across multiple boundary violations', async () => {
			const { screen, userEvent } = await renderDefault();
			expect(getResultText(screen)).toBe('50');

			await userEvent('#set-above-max', 'click');
			expect(getResultText(screen)).toBe('100');

			await userEvent('#set-below-min', 'click');
			expect(getResultText(screen)).toBe('1');
		});

		it('should recover correctly after boundary violation', async () => {
			const { screen, userEvent } = await renderDefault();

			await userEvent('#set-above-max', 'click');
			expect(getResultText(screen)).toBe('100');

			await userEvent('#set-min', 'click');
			expect(getResultText(screen)).toBe('1');

			await userEvent('#set-max', 'click');
			expect(getResultText(screen)).toBe('100');
		});
	});

	describe('custom ranges', () => {
		it('should work with a negative range', async () => {
			const { render, screen } = await createDOM();
			await render(<UseClampTestComponent initial={-5} min={-10} max={-1} />);
			expect(getResultText(screen)).toBe('-5');
		});

		it('should work when min and max are equal', async () => {
			const { render, screen } = await createDOM();
			await render(<UseClampTestComponent initial={99} min={50} max={50} />);
			expect(getResultText(screen)).toBe('50');
		});

		it('should work with a floating-point range', async () => {
			const { render, screen } = await createDOM();
			await render(<UseClampTestComponent initial={0.5} min={0.1} max={0.9} />);
			expect(getResultText(screen)).toBe('0.5');
		});
	});
});
