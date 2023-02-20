<script lang="ts">
	import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
    const api_ip = PUBLIC_API_IP;
    const api_port = PUBLIC_API_PORT;
    import type { PageData } from './$types';
    export let data: PageData
</script>

<header>
    <h1>praxisDB: Submit</h1>
</header>

<main class="main-content">
	<form action='http://{api_ip}:{api_port}/submit' method="post" enctype="multipart/form-data">
        <label for="buissenessName">Buisseness name (check <a href="https://www.brreg.no">brreg.no</a>):</label>
        <br />
        <input type="text" name="buissenessName" id="buissenessName" required>
        <br />

        <label for="buissenessNr">Buisseness' organisation number (check <a href="https://www.brreg.no">brreg.no</a>):</label>
        <br />
        <input type="number" name="buissenessNr" id="buissenessNr" required>
        <br />

        <label for="subject">Which education programme are you taking?</label>
        <br />
        <select name="subject" id="subject">
            {#each data.data as id}
                <option value={id.id}>{id.name}</option>
            {/each}
        </select>
        <br />

        <label for="responded">Did you recieve a response?</label>
        <br />
        <input type="checkbox" name="responded" id="responded">
        <br />

        <label for="accepted">Was your application accepted?</label>
        <br />
        <input type="checkbox" name="accepted" id="accepted">
        <br />

        <label for="imageUpload">Please upload an image so we can verify the request:</label>
        <br />
        <input type="file" name="imageUpload" id="imageUpload" accept=".jpg,.png" required>
        <br />
        
        <button type="submit">Submit</button>
    </form>
</main>