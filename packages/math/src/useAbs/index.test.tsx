import { createDOM } from '@builder.io/qwik/testing';
import { it, expect, describe } from 'vite-plus/test';
import { useAbs } from '.';
import { component$, useSignal } from '@builder.io/qwik';

const UseAbsTestComponent = component$<{ initial: number }>(({ initial }) => {
	const current = useSignal(initial);
	const result = useAbs(current);

	return (
		<div>
			<p id="result-text">{result.value}</p>
			<button id="set-negative" onClick$={() => (current.value = -100)}>
				Set Negative
			</button>
			<button id="set-positive" onClick$={() => (current.value = 75)}>
				Set Positive
			</button>
			<button id="set-zero" onClick$={() => (current.value = 0)}>
				Set Zero
			</button>
		</div>
	);
});

const getResultText = (screen: HTMLElement) =>
	(screen.querySelector('#result-text') as HTMLElement).textContent;

describe('useAbs', () => {
	describe('initial render', () => {
		it('should return the absolute value of a negative number', async () => {
			const { render, screen } = await createDOM();
			await render(<UseAbsTestComponent initial={-50} />);
			expect(getResultText(screen)).toBe('50');
		});

		it('should return the same value for a positive number', async () => {
			const { render, screen } = await createDOM();
			await render(<UseAbsTestComponent initial={50} />);
			expect(getResultText(screen)).toBe('50');
		});

		it('should return 0 for zero input', async () => {
			const { render, screen } = await createDOM();
			await render(<UseAbsTestComponent initial={0} />);
			expect(getResultText(screen)).toBe('0');
		});

		it('should handle decimal numbers', async () => {
			const { render, screen } = await createDOM();
			await render(<UseAbsTestComponent initial={-3.14} />);
			expect(getResultText(screen)).toBe('3.14');
		});
	});

	describe('reactivity', () => {
		it('should update reactively when signal changes from negative to more negative', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseAbsTestComponent initial={-50} />);
			expect(getResultText(screen)).toBe('50');

			await userEvent('#set-negative', 'click');
			expect(getResultText(screen)).toBe('100');
		});

		it('should update reactively when signal changes from negative to positive', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseAbsTestComponent initial={-50} />);

			await userEvent('#set-positive', 'click');
			expect(getResultText(screen)).toBe('75');
		});

		it('should update reactively when signal changes to zero', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseAbsTestComponent initial={-50} />);

			await userEvent('#set-zero', 'click');
			expect(getResultText(screen)).toBe('0');
		});

		it('should handle multiple sequential updates correctly', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseAbsTestComponent initial={-50} />);

			await userEvent('#set-negative', 'click');
			expect(getResultText(screen)).toBe('100');

			await userEvent('#set-positive', 'click');
			expect(getResultText(screen)).toBe('75');

			await userEvent('#set-zero', 'click');
			expect(getResultText(screen)).toBe('0');
		});
	});
});
