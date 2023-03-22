import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
import type { PageLoad } from './$types';
const api_ip = PUBLIC_API_IP;
const api_port = PUBLIC_API_PORT;

export const load: PageLoad = async ({ fetch }) => {
	const get = await fetch(`http://${api_ip}:${api_port}/submissions`);

	const data: {
		id: number;
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
	}[] = await get.json();

	return { data };
};
