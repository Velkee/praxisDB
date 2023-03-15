import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
const api_ip = PUBLIC_API_IP;
const api_port = PUBLIC_API_PORT;
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch(`http://${api_ip}:${api_port}/submissions`);

	const data: {
		company_id: number;
		timestamp: string;
		responded: boolean;
		accepted: boolean;
		admin_id: number | null;
		proof: string;
		company: {
			name: string;
			subjects: { name: string }[];
		};
		admin: { name: string } | null;
	}[] = await response.json();

	return { data };
};
