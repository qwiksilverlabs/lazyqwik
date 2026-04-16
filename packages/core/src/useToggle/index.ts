import { $, useSignal } from '@builder.io/qwik';

export function useToggle(initialValue: boolean = true) {
	const state = useSignal(initialValue);

	const toggle = $(() => {
		state.value = !state.value;
	});

	return [state.value, toggle] as const;
}
