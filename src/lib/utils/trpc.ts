/* eslint-disable @typescript-eslint/no-explicit-any */
export const tryParseTRPCError = async (e: any): Promise<string[]> => {
	try {
		return JSON.parse(JSON.parse(JSON.stringify(e?.shape?.message))).map((e: any) => e?.message);
	} catch (error) {
		return [e?.shape?.message];
	}
};
