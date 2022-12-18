import type { BaseResponse } from '$lib/store/auth/auth.store';
import client from '$lib/utils/client';
import { useMutation, useQuery } from '@sveltestack/svelte-query';
import { z } from 'zod';

export interface EmployeeResponse {
	data: Employee[];
	metadata: Metadata;
}

interface Metadata {
	total: number;
	page: number;
	limit: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export const putEmployeeSchema = z.object({
	email: z.string().email().optional(),
	employeeType: z.enum(['ADMIN', 'EMPLOYEE']).optional(),
	firstName: z.string().min(1).optional(),
	lastName: z.string().min(1).optional(),
	password: z.string().min(1).optional()
});

export interface Employee {
	id: string;
	firstName: string;
	lastName: string;
	employeeType: z.infer<typeof putEmployeeSchema>['employeeType'];
	email: string;
	createdAt: string;
	password: string;
	updatedAt: string;
}

export type PutEmployee = z.infer<typeof putEmployeeSchema>;

export const useUpdateEmployee = () => {
	return useMutation(
		({ data, id }: { id: string; data: PutEmployee }) => client.put(`/api/employee/${id}`, data),
		{
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			onSuccess(data, variables, context) {
				console.log('Invalidating employee queries');
			}
		}
	);
};

export const useFetchAllEmployees = ({ limit, offset }: { limit: number; offset: number }) => {
	return useQuery(
		['employees', limit, offset],
		() =>
			client.get<BaseResponse<EmployeeResponse>>(`/api/employee?limit=${limit}&offset=${offset}`),
		{
			enabled: limit > 0 && offset >= 0
		}
	);
};

export const useDeleteEmployee = () => {
	return useMutation((id: string) => client.delete(`/api/employee/${id}`), {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		onSuccess(data, variables, context) {
			console.log('Invalidating employee queries');
		}
	});
};
