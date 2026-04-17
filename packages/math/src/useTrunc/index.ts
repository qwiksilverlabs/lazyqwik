import { useComputed$ } from '@builder.io/qwik';
import { MaybeSignal, toValue } from '@qwikgear/shared';

export function useTrunc(value: MaybeSignal<number>) {
	return useComputed$(() => Math.trunc(toValue(value)));
}
