import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
const api_ip = PUBLIC_API_IP;
const api_port = PUBLIC_API_PORT;

export const load: PageServerLoad = async ({ fetch }) => {
	const check = await fetch(`http://${api_ip}:${api_port}/isloggedin`);

	if (check.ok) {
		throw redirect(303, '/admin');
	}
};
