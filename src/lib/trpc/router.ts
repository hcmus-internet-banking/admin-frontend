import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { auth } from './routes/auth';
import { t } from './t';

export const router = t.router({
	greeting: t.procedure.query(async () => {
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
	}),
	auth: auth
});
// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
export type Router = typeof router;
