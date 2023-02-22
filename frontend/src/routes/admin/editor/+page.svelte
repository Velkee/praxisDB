<header>
    <h1>praxisDB: Admin Editor</h1>
    <a href="/"><p>Back to Front Page</p></a>
</header>

<script lang="ts">
    import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public'
    const api_ip = PUBLIC_API_IP;
    const api_port = PUBLIC_API_PORT;
    import type { PageData } from './$types';
    export let data: PageData
</script>

<main class="main-content">
    <form action='http://{api_ip}:{api_port}/newadmin' method="post">
        <h2>Register a new admin</h2>
        <label for="adminUsername">Admin's username:</label>
        <br />
        <input type="text" name="adminUsername" id="adminUsername" required>
        <br />

        <label for="adminPassword">Admin's password:</label>
        <br />
        <input type="password" name="adminPassword" id="adminPassword" required>
        <br />

        <button type="submit">Submit</button>
    </form>

    <form action='http://{api_ip}:{api_port}/editadmin' method="post">
        <h2>Edit an existing admin</h2>
        <label for="adminId">Admin's username:</label>
        <br />
        <select name="adminId" id="adminId">
            {#each data.data as admin}
                <option value="{admin.id}">{admin.username}</option>
            {/each}
        </select>
        <br />

        <label for="newPassword">New password:</label>
        <br />
        <input type="password" name="newPassword" id="newPassword" required />
        <br />

        <button type="submit">Submit</button>
    </form>

    <form action='http://{api_ip}:{api_port}/deleteadmin' method="post">
        <h2>Remove an admin</h2>
        <label for="adminId">Admin's username:</label>
        <br />
        <select name="adminId" id="adminId">
            {#each data.data as admin}
                <option value="{admin.id}">{admin.username}</option>
            {/each}
        </select>
        <br />

        <label for="checkbox">WARNING: This will permanently delete this admin and unverify all their verified submissions, are you sure?</label>
        <br />
        <input type="checkbox" name="warning" id="warning">
        <br />

        <button type="submit">Submit</button>
    </form>
</main>