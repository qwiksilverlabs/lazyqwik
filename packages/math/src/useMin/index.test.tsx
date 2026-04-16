import { createDOM } from '@builder.io/qwik/testing';
import { it, expect, describe } from 'vite-plus/test';
import { useMin } from '.';
import { component$, useSignal } from '@builder.io/qwik';

interface UseMinTestProps {
	a: number;
	b: number;
}

const UseMinTestComponent = component$<UseMinTestProps>(({ a, b }) => {
	const value1 = useSignal(a);
	const minResult = useMin(value1, b);
	return (
		<div>
			<p id="result-text">{minResult.value}</p>
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

const DEFAULT_A = 100;
const DEFAULT_B = 99;

const renderDefault = async (a = DEFAULT_A, b = DEFAULT_B) => {
	const { render, screen, userEvent } = await createDOM();
	await render(<UseMinTestComponent a={a} b={b} />);
	return { screen, userEvent };
};

describe('useMin', () => {
	describe('initial render', () => {
		it('should return b when a is greater than b', async () => {
			const { screen } = await renderDefault(100, 99);
			expect(getResultText(screen)).toBe('99');
		});

		it('should return a when a is less than b', async () => {
			const { screen } = await renderDefault(5, 99);
			expect(getResultText(screen)).toBe('5');
		});

		it('should return b when a equals b', async () => {
			const { screen } = await renderDefault(99, 99);
			expect(getResultText(screen)).toBe('99');
		});

		it('should handle both negative values', async () => {
			const { screen } = await renderDefault(-3, -10);
			expect(getResultText(screen)).toBe('-10');
		});

		it('should handle a negative and a positive', async () => {
			const { screen } = await renderDefault(50, -50);
			expect(getResultText(screen)).toBe('-50');
		});

		it('should handle zero inputs', async () => {
			const { screen } = await renderDefault(0, 0);
			expect(getResultText(screen)).toBe('0');
		});

		it('should handle floating-point values', async () => {
			const { screen } = await renderDefault(1.6, 1.5);
			expect(getResultText(screen)).toBe('1.5');
		});
	});

	describe('reactivity', () => {
		it('should return b when signal rises above b', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-higher', 'click');
			expect(getResultText(screen)).toBe('99');
		});

		it('should return b when signal equals b', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-equal', 'click');
			expect(getResultText(screen)).toBe('99');
		});

		it('should return signal value when it drops below b', async () => {
			const { screen, userEvent } = await renderDefault();
			await userEvent('#set-lower', 'click');
			expect(getResultText(screen)).toBe('98');
		});

		it('should update correctly across multiple transitions', async () => {
			const { screen, userEvent } = await renderDefault();

			await userEvent('#set-lower', 'click');
			expect(getResultText(screen)).toBe('98');

			await userEvent('#set-higher', 'click');
			expect(getResultText(screen)).toBe('99');

			await userEvent('#set-equal', 'click');
			expect(getResultText(screen)).toBe('99');

			await userEvent('#set-lower', 'click');
			expect(getResultText(screen)).toBe('98');
		});
	});
});
