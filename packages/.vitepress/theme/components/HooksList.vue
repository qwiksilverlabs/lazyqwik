<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { metadata } from '@lazyqwik/metadata';
import { upperFirst } from 'es-toolkit';

const activeModule = ref<string | null>(null);

const updateFromHash = () => {
	const hashString = window.location.hash.slice(1);
	const params = Object.fromEntries(new URLSearchParams(hashString).entries());

	activeModule.value = params.module || null;
};

onMounted(() => {
	updateFromHash();
	window.addEventListener('hashchange', updateFromHash);
});

onUnmounted(() => {
	window.removeEventListener('hashchange', updateFromHash);
});

const data = computed(() => {
	return !activeModule.value
		? metadata
		: metadata.filter((item) => item.module === activeModule.value);
});
</script>

<template>
	<div v-for="module in data" :key="module.module">
		<h3>{{ upperFirst(module.module) }}</h3>
		<ul>
			<li v-for="hook in module.hooks" :key="hook.name">
				<a :href="`/${module.module}/${hook.name}/`">{{ hook.name }}</a> -
				{{ hook.description }}
			</li>
		</ul>
	</div>
</template>
