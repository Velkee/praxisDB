import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
const api_ip = PUBLIC_API_IP;
const api_port = PUBLIC_API_PORT;
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch(`http://${api_ip}:${api_port}/subjects`);

	const data: { id: number; name: string }[] = await response.json();

	console.log(data);
	return { data };
};

export const prerender = false;
