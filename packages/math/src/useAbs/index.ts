import { useComputed$ } from '@builder.io/qwik';
import { MaybeSignal, toValue } from '@qwikgear/shared';

export function useAbs(value: MaybeSignal<number>) {
	return useComputed$(() => Math.abs(toValue(value)));
}
