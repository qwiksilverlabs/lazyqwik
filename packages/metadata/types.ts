interface Hook {
	name: string;
	description: string;
}

interface ModuleHooks {
	module: string;
	hooks: Hook[];
}

type ModuleMap = Record<string, ModuleHooks>;

export type { Hook, ModuleHooks, ModuleMap };
