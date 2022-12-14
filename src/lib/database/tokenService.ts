import { TRPCError } from '@trpc/server';
import { prisma } from '$lib/utils/prisma';
import { Prisma, TokenType } from '@prisma/client';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

const defaultTokenSelector: Prisma.TokenSelect = {
	id: true,
	token: true,
	expiredAt: true
};

export type DefaultTokenSelector = Prisma.TokenGetPayload<{
	select: typeof defaultTokenSelector;
}>;

export interface AccessTokenPayload extends JwtPayload {
	id: string;
}

export const COOKIES_TOKEN_NAME = 'accessToken';

export class TokenService {
	static generateToken = async ({
		expiredAt,
		type,
		userId
	}: {
		type: TokenType;
		expiredAt: Date;
		userId?: string;
	}): Promise<DefaultTokenSelector | null> => {
		try {
			const token = await prisma.token.create({
				data: {
					type,
					expiredAt,
					token: randomUUID(),
					userId: userId
				},
				select: defaultTokenSelector
			});

			return token;
		} catch (error) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Failed to generate token'
			});
		}
	};

	static generateAccessToken = async (
		payload: AccessTokenPayload,
		expiresIn: string
	): Promise<string | undefined> => {
		const secret = process.env.JWT_SECRET || 'xinchaocacbanlailachaod4y';

		return new Promise<string | undefined>((resolve, reject) => {
			jwt.sign(payload, secret, { expiresIn }, (err, token) => {
				if (err) {
					reject(err);
				}

				resolve(token);
			});
		});
	};

	static getToken = async (token: string): Promise<DefaultTokenSelector | null> => {
		const tokenData = await prisma.token.findFirst({
			where: { token }
		});

		return tokenData;
	};

	static validateAccessToken = async (token: string): Promise<AccessTokenPayload> => {
		// skip bearer if there is any
		const accessToken = token.replace('Bearer ', '');

		const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'xinchaocacbanlailachaod4y';

		return new Promise((resolve, reject) => {
			jwt.verify(accessToken, secret, (err, decoded) => {
				if (err) {
					reject(err);
				}

				resolve(decoded as AccessTokenPayload);
			});
		});
	};

	static blackListToken = async (token: string): Promise<void> => {
		await prisma.token.updateMany({
			where: { token },
			data: {
				isBlacklisted: true
			}
		});
	};

	static validateRefreshToken = async (token: string): Promise<boolean> => {
		const tokenData = await prisma.token.findFirst({
			where: { token, type: TokenType.REFRESH, isBlacklisted: false },
			select: {
				expiredAt: true
			}
		});

		if (!tokenData) {
			return false;
		}

		if (tokenData.expiredAt < new Date()) {
			console.log(tokenData.expiredAt, new Date());
			return false;
		}

		return true;
	};
}
