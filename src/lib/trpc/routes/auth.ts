import { t } from '$lib/trpc/t';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '$lib/utils/prisma';
import { comparePassword } from '$lib/utils/bcrypt';
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export const auth = t.router({
	login: t.procedure
		.input(
			z.object({
				email: z.string().email('Must be a valid email address'),
				password: z.string().min(8, 'Password must be at least 8 characters')
			})
		)
		.mutation(async ({ input: { password, email: username } }) => {
			const user = await prisma.user
				.findUniqueOrThrow({
					where: {
						email: username
					}
				})
				.catch(() => {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Incorrect email'
					});
				});

			if (await comparePassword(password, user.password)) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Incorrect password'
				});
			}

			return { username };
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}),

	register: t.procedure
		.input(
			z.object({
				email: z.string().email('Must be a valid email address'),
				password: z.string().min(8, 'Password must be at least 8 characters'),
				firstName: z.string().min(1, 'First name must be at least 1 character'),
				lastName: z.string().min(1, 'Last name must be at least 1 character')
			})
		)
		.mutation(async ({ input: { password, email, firstName, lastName } }) => {
			const user = await prisma.user
				.create({
					data: {
						email,
						password,
						firstName,
						lastName
					}
				})
				.catch((e: PrismaClientKnownRequestError) => {
					if (e.code === 'P2002') {
						throw new TRPCError({
							code: 'BAD_REQUEST',
							message: 'Email already exists'
						});
					} else {
						throw new TRPCError({
							code: 'BAD_REQUEST',
							message: 'Something went wrong'
						});
					}
				});

			return user;
		})
});
