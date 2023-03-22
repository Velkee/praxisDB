<script lang="ts">
	import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
	import type { PageData } from './$types';
	export let data: PageData;
	const api_ip = PUBLIC_API_IP;
	const api_port = PUBLIC_API_PORT;
</script>

<header>
	<h1>praxisDB: Submission Editor</h1>
	<a href="/"><p>Back to Front Page</p></a>
</header>

<main class="main-content">
	<form>
		<p>Company name: {data.check.company.name}</p>
		<input type="text" name="companyName" id="companyName" />
		<p>Company number: {data.check.company_id}</p>
		<input type="text" name="companyId" id="companyId" />
		<p>Last checked: {data.check.timestamp.slice(0, 10)}</p>
		<input type="datetime-local" name="timestamp" id="timestamp" />
		<p>
			Did the company respond?
			{#if data.check.responded === true}
				Yes
			{:else}
				No
			{/if}
		</p>
		<input type="checkbox" name="responded" id="responded" />
		<p>
			Was the student accepted?
			{#if data.check.accepted === true}
				Yes
			{:else}
				No
			{/if}
		</p>
		<input type="checkbox" name="responded" id="responded" />
		<p>
			Verified by:
			{#if data.check.admin_id === null}
				Not verified
			{:else}
				{data.check.admin?.name}
			{/if}
		</p>
		<select name="admin" id="admin">
			{#each data.admins as admin}
				<option value={admin.id}>{admin.name}</option>
			{/each}
		</select>
	</form>
</main>
