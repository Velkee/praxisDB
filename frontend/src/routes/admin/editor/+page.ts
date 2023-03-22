import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
import type { PageLoad } from './$types';
const api_ip = PUBLIC_API_IP;
const api_port = PUBLIC_API_PORT;

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch(`http://${api_ip}:${api_port}/admins`);
	const data: { id: number; username: string }[] = await response.json();

	return { data };
};
