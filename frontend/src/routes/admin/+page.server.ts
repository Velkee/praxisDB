import type { PageServerLoad } from './$types';
import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
const api_ip = PUBLIC_API_IP;
const api_port = PUBLIC_API_PORT;

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`http://${api_ip}:${api_port}/isloggedin`);

	if (!response.ok) {
		throw redirect(303, '/admin/login');
	}
};

export const prerender = false;
