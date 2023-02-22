<header>
	<h1>praxisDB: Login</h1>
    <a href="/"><p>Back to Front Page</p></a>
</header>

<script>
    // @ts-ignore
    import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public'
    const api_ip = PUBLIC_API_IP;
    const api_port = PUBLIC_API_PORT;
</script>

<main class="main-content">
    <form action='http://{api_ip}:{api_port}/admin/login' method="post">
        <label for="adminUsername">Username:</label>
        <br />
        <input type="text" name="adminUsername" id="adminUsername" required>
        <br />

        <label for="adminPassword">Password:</label>
        <br />
        <input type="password" name="adminPassword" id="adminPassword" required>
        <br />
        
        <button type="submit">Submit</button>
    </form>
</main>