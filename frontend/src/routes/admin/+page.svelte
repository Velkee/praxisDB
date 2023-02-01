<header>
    <h1>praxisDB: Admin Pannel</h1>
</header>

<script>
    // @ts-ignore
    import { PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public'
    const api_ip = PUBLIC_API_IP;
    const api_port = PUBLIC_API_PORT;
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
</main>