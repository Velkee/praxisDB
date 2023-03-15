import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
const api_ip = PUBLIC_API_IP;
const api_port = PUBLIC_API_PORT;
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const check = await fetch(`http://${api_ip}:${api_port}/isloggedin`);

	if (!check.ok) {
		throw redirect(303, '/admin/login');
	}

	const response = await fetch(`http://${api_ip}:${api_port}/admins`);
	const data: { id: number; username: string }[] = await response.json();

	return { data };
};

export const prerender = false;
