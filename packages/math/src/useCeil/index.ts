import { useComputed$ } from '@builder.io/qwik';
import { MaybeSignal, toValue } from '@qwikgear/shared';

export function useCeil(value: MaybeSignal<number>) {
	return useComputed$(() => Math.ceil(toValue(value)));
}
