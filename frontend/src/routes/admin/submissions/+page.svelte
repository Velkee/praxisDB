<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<header>
	<h1>praxisDB: Edit Submissions</h1>
	<a href="/"><p>Back to Front Page</p></a>
</header>

<main class="main-content">
	<div class="split-up">
		{#each data.data as check}
			<div>
				<p>Company name: {check.company.name}</p>
				<p>Company number: {check.company_id}</p>
				<p>Last checked: {check.date.slice(0, 10)}</p>
				<p>
					Did the company respond?
					{#if check.responded === true}
						Yes
					{:else}
						No
					{/if}
				</p>
				<p>
					Was the student accepted?
					{#if check.accepted === true}
						Yes
					{:else}
						No
					{/if}
				</p>
				<p>
					Verified by:
					{#if check.admin_id === null}
						Not verified
					{:else}
						{check.admin?.name}
					{/if}
				</p>
				<a href="/admin/submissions/edit/{check.id}">Edit</a>
			</div>
		{/each}
	</div>
</main>
