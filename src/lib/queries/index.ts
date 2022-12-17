import { QueryClient } from '@sveltestack/svelte-query';

export * as employeeQueries from './employee';

export const queryClient = new QueryClient();
