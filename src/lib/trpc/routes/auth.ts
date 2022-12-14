import { hashPassword } from './../../utils/bcrypt';
import { TokenService } from './../../database/tokenService';
import { t } from '$lib/trpc/t';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '$lib/utils/prisma';
import { comparePassword } from '$lib/utils/bcrypt';
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { TokenType } from '@prisma/client';
import moment from 'moment';
import {
	PUBLIC_ACCESS_TOKEN_EXPIRES_IN_MINUTES,
	PUBLIC_REFRESH_TOKEN_EXPIRES_IN_DAYS
} from '$env/static/public';

export const auth = t.router({
	login: t.procedure
		.input(
			z.object({
				email: z.string().email('Must be a valid email address'),
				password: z.string().min(8, 'Password must be at least 8 characters')
			})
		)
		.mutation(async ({ input: { password, email } }) => {
			const user = await prisma.user
				.findUniqueOrThrow({
					where: {
						email
					}
				})
				.catch(() => {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Incorrect email'
					});
				});

			const isPasswordCorrect = await comparePassword(password as string, user.password);

			if (!isPasswordCorrect) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Incorrect password'
				});
			}

			const [refreshToken, accessToken] = await Promise.all([
				TokenService.generateToken({
					type: TokenType.REFRESH,
					expiredAt: moment()
						.add(parseInt(PUBLIC_REFRESH_TOKEN_EXPIRES_IN_DAYS) || 30, 'days')
						.toDate(),
					userId: user.id
				}).then((token) => token?.token),
				TokenService.generateAccessToken(
					{ id: user.id },
					PUBLIC_ACCESS_TOKEN_EXPIRES_IN_MINUTES || '15m'
				)
			]);

			return {
				email,
				tokens: {
					refreshToken,
					accessToken
				}
			};
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
						password: await hashPassword(password),
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
	return this.toString();
};
