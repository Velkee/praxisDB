<script lang="ts">
	import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
	const api_ip = PUBLIC_API_IP;
	const api_port = PUBLIC_API_PORT;
</script>

<header>
	<h1>praxisDB: Admin Pannel</h1>
	<a href="/"><p>Back to Front Page</p></a>
</header>

<main class="main-content">
	<div class="split-up">
		<a href="admin/submissions"><h2>Submissions</h2></a>
		<a href="admin/editor"><h2>Account editor</h2></a>
	</div>

	<div class="split-up">
		<a href="http://{api_ip}:{api_port}/logout"><h2>Logout</h2></a>
	</div>
</main>
