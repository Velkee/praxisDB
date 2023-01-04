<header>
    <h1>praxisDB: Submit</h1>
</header>

<main class="main-content">
    <form action="http://localhost:23450/send" method="post" enctype="multipart/form-data">
        <label for="buissenessName">Buisseness name (case insensitive):</label>
        <br />
        <input type="text" name="buissenessName" id="buissenessName">
        <br />

        <label for="buissenessNr">Buisseness' organisation number (check <a href="https://www.brreg.no">brreg.no</a>):</label>
        <br />
        <input type="number" name="buissenessNr" id="buissenessNr">
        <br />

        <label for="subject">Which education programme are you taking?</label>
        <br />
        <input type="text" name="subject" id="subject">
        <br />

        <label for="imageUpload">Please upload an image so we can verify the request:</label>
        <br />
        <input type="file" name="imageUpload" id="imageUpload" accept=".jpg,.png">
        <br />
        <button type="submit">Submit</button>
    </form>
</main>