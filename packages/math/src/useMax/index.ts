import { isSignal, ReadonlySignal, useComputed$ } from '@builder.io/qwik';
import { MaybeSignal } from '@qwikgear/shared';

export function useMax(
	...numbers: MaybeSignal<number>[] | [MaybeSignal<number[]>]
): ReadonlySignal<number> {
	return useComputed$<number>(() => {
		const flatNumbers = Array.isArray(numbers[0])
			? numbers[0]
			: (numbers as MaybeSignal<number>[]);

		const values = flatNumbers.map((arg) => {
			return isSignal(arg) ? arg.value : arg;
		});

		return Math.max(...values);
	});
}
