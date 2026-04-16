import { createDOM } from '@builder.io/qwik/testing';
import { it, expect, describe } from 'vite-plus/test';
import { useMax } from '.';
import { component$, useSignal } from '@builder.io/qwik';

interface UseMaxTestProps {
	a: number;
	b: number;
}

const UseMaxTestComponent = component$<UseMaxTestProps>(({ a, b }) => {
	const value1 = useSignal(a);
	const maxResult = useMax(value1, b);
	return (
		<div>
			<p id="result-text">{maxResult.value}</p>
			<button id="set-lower" onClick$={() => (value1.value = b - 1)}>
				Set Lower Than B
			</button>
			<button id="set-equal" onClick$={() => (value1.value = b)}>
				Set Equal To B
			</button>
			<button id="set-higher" onClick$={() => (value1.value = b + 1)}>
				Set Higher Than B
			</button>
		</div>
	);
});

const getResultText = (screen: ParentNode) =>
	(screen.querySelector('#result-text') as HTMLElement).textContent;

const DEFAULT_A = 1;
const DEFAULT_B = 100;

const renderDefault = async (a = DEFAULT_A, b = DEFAULT_B) => {
	const { render, screen, userEvent } = await createDOM();
	await render(<UseMaxTestComponent a={a} b={b} />);
	return { screen, userEvent };
};

describe('useMax', () => {
	describe('initial render', () => {
		it('should return b when a is less than b', async () => {
			const { screen } = await renderDefault(1, 100);
			expect(getResultText(screen)).toBe('100');
		});

		it('should return a when a is greater than b', async () => {
			const { screen } = await renderDefault(200, 100);
			expect(getResultText(screen)).toBe('200');
		});

		it('should return b when a equals b', async () => {
			const { screen } = await renderDefault(100, 100);
			expect(getResultText(screen)).toBe('100');
		});

		it('should handle both negative values', async () => {
			const { screen } = await renderDefault(-10, -3);
			expect(getResultText(screen)).toBe('-3');
		});

		it('should handle a negative and a positive', async () => {
			const { screen } = await renderDefault(-50, 50);
			expect(getResultText(screen)).toBe('50');
		});

		it('should handle zero inputs', async () => {
			const { screen } = await renderDefault(0, 0);
			expect(getResultText(screen)).toBe('0');
		});

		it('should handle floating-point values', async () => {
			const { screen } = await renderDefault(1.5, 1.6);
			expect(getResultText(screen)).toBe('1.6');
		});
	});

	describe('reactivity', () => {
		it('should return b when signal drops below b', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-lower', 'click');
			expect(getResultText(screen)).toBe('100');
		});

		it('should return b when signal equals b', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-equal', 'click');
			expect(getResultText(screen)).toBe('100');
		});

		it('should return signal value when it exceeds b', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-higher', 'click');
			expect(getResultText(screen)).toBe('101');
		});

		it('should update correctly across multiple transitions', async () => {
			const { screen, userEvent } = await renderDefault();

			await userEvent('#set-higher', 'click');
			expect(getResultText(screen)).toBe('101');

			await userEvent('#set-lower', 'click');
			expect(getResultText(screen)).toBe('100');

			await userEvent('#set-equal', 'click');
			expect(getResultText(screen)).toBe('100');

			await userEvent('#set-higher', 'click');
			expect(getResultText(screen)).toBe('101');
		});
	});
});
