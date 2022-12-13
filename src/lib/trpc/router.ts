import { auth } from './routes/auth';
import { t } from './t';

export const router = t.router({
	greeting: t.procedure.query(async () => {
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
	}),
	auth: auth
});

export type Router = typeof router;
