import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
import type { PageLoad } from './$types';
const api_ip = PUBLIC_API_IP;
const api_port = PUBLIC_API_PORT;

export const load: PageLoad = async ({ fetch, params }) => {
	const getSubmission = await fetch(
		`http://${api_ip}:${api_port}/submissions/${params.submission}`
	);

	const check: {
		id: number;
		company_id: number;
		date: string;
		responded: boolean;
		accepted: boolean;
		admin_id: number | null;
		proof: string;
		company: { name: string; subjects: { name: string }[] };
		admin: { name: string } | null;
	} = await getSubmission.json();

	const getAdmins = await fetch(`http://${api_ip}:${api_port}/admins`);

	const admins: {
		id: number;
		username: string;
	}[] = await getAdmins.json();

	return { check, admins };
};
