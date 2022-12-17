import type { BaseResponse } from '$lib/store/auth/auth.store';
import client from '$lib/utils/client';
import { useQuery } from '@sveltestack/svelte-query';

export interface Employee {
	id: string;
	firstName: string;
	lastName: string;
	employeeType: string;
}

export const useGetEmployees = (limit: number, offset: number) =>
	useQuery(['employees'], async () => {
		const response = await client.get<BaseResponse<Employee[]>>('/api/employee', {
			params: {
				limit,
				offset
			}
		});

		return response.data.data;
	});
