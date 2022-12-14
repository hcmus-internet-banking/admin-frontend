import { JWT_SECRET } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

interface AppPayload extends JwtPayload {
	id: string;
}

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
	try {
		const token = event.request.headers.get('authorization')?.replace('Bearer ', '');

		if (!token) {
			throw new Error('No token');
		}

		const { id: userId } = jwt.verify(token, JWT_SECRET) as AppPayload;

		return {
			userId
		};
	} catch (error) {
		return { userId: '' };
	}
}

export type Context = inferAsyncReturnType<typeof createContext>;
