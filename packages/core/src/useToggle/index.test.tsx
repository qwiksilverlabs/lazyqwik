import { createDOM } from '@builder.io/qwik/testing';
import { it, expect, describe } from 'vite-plus/test';
import { useToggle } from '.';
import { component$ } from '@builder.io/qwik';

const UseToggleTestComponent = component$<{ initial?: boolean }>(({ initial }) => {
	const [value, toggle] = useToggle(initial);
	return (
		<div>
			<p id="value">{String(value)}</p>
			<button id="toggle-btn" onClick$={toggle}>
				Toggle
			</button>
		</div>
	);
});

const UseToggleInspectComponent = component$<{ initial?: boolean }>(({ initial }) => {
	const result = useToggle(initial);
	const [value, toggle] = result;
	return (
		<div>
			<p id="is-array">{String(Array.isArray(result))}</p>
			<p id="length">{result.length}</p>
			<p id="toggle-type">{typeof toggle}</p>
			<p id="value">{String(value)}</p>
		</div>
	);
});

const getText = (screen: ParentNode, id: string) =>
	(screen.querySelector(`#${id}`) as HTMLElement).textContent;

describe('useToggle', () => {
	describe('return shape', () => {
		it('should return an array', async () => {
			const { render, screen } = await createDOM();
			await render(<UseToggleInspectComponent />);
			expect(getText(screen, 'is-array')).toBe('true');
		});

		it('should return an array of length 2', async () => {
			const { render, screen } = await createDOM();
			await render(<UseToggleInspectComponent />);
			expect(getText(screen, 'length')).toBe('2');
		});

		it('second element should be a function', async () => {
			const { render, screen } = await createDOM();
			await render(<UseToggleInspectComponent />);
			expect(getText(screen, 'toggle-type')).toBe('function');
		});
	});

	describe('initial value', () => {
		it('should default to true when no initial value is provided', async () => {
			const { render, screen } = await createDOM();
			await render(<UseToggleTestComponent />);
			expect(getText(screen, 'value')).toBe('true');
		});

		it('should use provided initial value of false', async () => {
			const { render, screen } = await createDOM();
			await render(<UseToggleTestComponent initial={false} />);
			expect(getText(screen, 'value')).toBe('false');
		});

		it('should use provided initial value of true', async () => {
			const { render, screen } = await createDOM();
			await render(<UseToggleTestComponent initial={true} />);
			expect(getText(screen, 'value')).toBe('true');
		});
	});

	describe('toggle behaviour', () => {
		it('should toggle from false to true', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseToggleTestComponent initial={false} />);
			expect(getText(screen, 'value')).toBe('false');

			await userEvent('#toggle-btn', 'click');
			expect(getText(screen, 'value')).toBe('true');
		});

		it('should toggle from true to false', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseToggleTestComponent initial={true} />);
			expect(getText(screen, 'value')).toBe('true');

			await userEvent('#toggle-btn', 'click');
			expect(getText(screen, 'value')).toBe('false');
		});

		it('should toggle back to original value on second click', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseToggleTestComponent initial={false} />);

			await userEvent('#toggle-btn', 'click');
			expect(getText(screen, 'value')).toBe('true');

			await userEvent('#toggle-btn', 'click');
			expect(getText(screen, 'value')).toBe('false');
		});

		it('should handle multiple sequential toggles correctly', async () => {
			const { render, screen, userEvent } = await createDOM();
			await render(<UseToggleTestComponent initial={false} />);

			const expected = ['true', 'false', 'true', 'false'];
			for (const val of expected) {
				await userEvent('#toggle-btn', 'click');
				expect(getText(screen, 'value')).toBe(val);
			}
		});
	});
});
