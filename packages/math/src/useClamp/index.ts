import { useComputed$ } from '@builder.io/qwik';
import { getSignalValue, MaybeSignal } from '@qwikgear/shared';

export function useClamp(
	current: MaybeSignal<number>,
	min: MaybeSignal<number>,
	max: MaybeSignal<number>,
) {
	return useComputed$(() =>
		Math.min(Math.max(getSignalValue(current), getSignalValue(min)), getSignalValue(max)),
	);
}
