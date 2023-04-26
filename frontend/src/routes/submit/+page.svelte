<script lang="ts">
	import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
	const api_ip = PUBLIC_API_IP;
	const api_port = PUBLIC_API_PORT;
	import type { PageData } from './$types';
	export let data: PageData;

	interface Unit {
		navn: string;
		organisasjonsnummer: string;
	}

	interface UnitData {
		_embedded: {
			enheter: Unit[];
		};
	}

	let searchText: string;
	let companyId: string;
	let timeout: number | undefined;
	let unitList: Unit[] = [];
	let selectedUnit: Unit | null = null;

	async function search() {
		const response = await fetch(
			`https://data.brreg.no/enhetsregisteret/api/enheter?navn=${searchText}`
		);
		const data: UnitData = await response.json();
		unitList = data?._embedded?.enheter || [];
		selectedUnit = unitList[0] || null;
		console.log(unitList);
	}

	function handleInput() {
		clearTimeout(timeout);
		timeout = setTimeout(search, 2000);
	}

	function handleSelectionChange() {
		searchText = selectedUnit?.navn || '';
		companyId = selectedUnit?.organisasjonsnummer || '';
	}
</script>

<header>
	<h1>praxisDB: Submit</h1>
	<a href="/"><p>Back to Front Page</p></a>
</header>

<main class="main-content">
	<form
		action="http://{api_ip}:{api_port}/submit"
		method="post"
		enctype="multipart/form-data"
	>
		<label for="companyName"
			>Company name (searches <a
				href="https://www.brreg.no"
				target="_blank"
				rel="noreferrer">brreg.no</a
			>):</label
		>
		<br />
		<input
			type="text"
			name="companyName"
			id="companyName"
			bind:value={searchText}
			on:input={handleInput}
			on:change={handleSelectionChange}
			required
		/>
		<br />

		<select bind:value={selectedUnit} on:change={handleSelectionChange}>
			{#each unitList as unit}
				<option value={unit}>{unit.navn}</option>
			{/each}
		</select>
		<br />

		<input
			type="text"
			bind:value={companyId}
			name="companyId"
			id="companyId"
			hidden
			required
		/>

		<label for="subject">Which education programme are you taking?</label>
		<br />
		<select name="subject" id="subject">
			{#each data.data as subject}
				<option value={subject.id}>{subject.name}</option>
			{/each}
		</select>
		<br />

		<label for="responded">Did you recieve a response?</label>
		<br />
		<input type="checkbox" name="responded" id="responded" />
		<br />

		<label for="accepted">Was your application accepted?</label>
		<br />
		<input type="checkbox" name="accepted" id="accepted" />
		<br />

		<label for="imageUpload"
			>Please upload an screenshot so we can verify the validity of the
			submission:</label
		>
		<br />
		<input
			type="file"
			name="imageUpload"
			id="imageUpload"
			accept=".jpg,.png"
			required
		/>
		<br />

		<button type="submit">Submit</button>
	</form>
</main>
