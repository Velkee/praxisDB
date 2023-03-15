<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<!-- <br />
<div align="center">
  <a href="https://github.com/Velkee/praxisDB">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
-->

<div align="center">
  <h3>praxisDB</h3>

  <p>
    A project to help keep track of Norwegian workplaces accepting praxis students for YFF
    <br />
    <br />
    <br />
    ·
    <a href="https://github.com/Velkee/praxisDB/issues">Report Bug</a>
    ·
    <a href="https://github.com/Velkee/praxisDB/issues">Request Feature</a>
  </p>
</div>

<br />

<div align="center">
  <h2>How to use</h2>
  <h3>Dependencies:</h3>
  <p>
    <a href="https://nodejs.org/">Node.js</a>,
    <a href="https://docker.com/">Docker</a>
  </p>

  <br />

  <p>
  To start, clone the repository using <code>git</code> or download the repository by pressing the "Code" button and selecting "Download ZIP"
  </p>

  <p>
  Remember to set the environment variables using the <code>.env</code> files! An example file is available in each folder
  </p>

  <br />

  <h3>Starting the backend:</h3>
  <p>
    · Open a terminal window and navigate to <code>[...]/praxisDB/backend</code>
  </p>
  <p>
    · Build the image for the backend using <code>docker compose build</code>
  </p>
  <p>
    · Start the backend using Docker with <code>docker compose up -d</code>
  </p>
  <p>
    · If this doesn't work, double check that you have Docker installed and that it's in your path
  </p>

  <br />

  <h3>Starting the API:</h3>

  <p>
    · Open a terminal window and navigate to <code>[...]/praxisDB/api</code>
  </p>
  <p>
    · Start the API using Node.js with <code>npm run start</code>
  </p>
  <p>
    · The API will stop running if the terminal is closed or process is aborted
  </p>
  <p>
    · If this doesn't work, double check that you have Node.js installed and that it's in your path
  </p>

  <br />

  <h3>Starting the frontend:</h3>

  <p>
    · Open a terminal window and navigate to <code>[...]/praxisDB/frontend</code>
  </p>
  <p>
    · Build the frontend with <code>npm run build</code>
  </p>
  <p>
    · Run the frontend with <code>PORT={your desired port} node build/index.js</code>
  </p>
  <p> -- OR --
  <p>
    · Run a preview of the frontend with <code>npm run preview</code>. Default port is <code>5173</code>
  </p>
  <br />
  <p>
    · The frontend will stop running if the terminal is closed or process is aborted
  </p>
  <p>
    · If this doesn't work, double check that you have Node.js installed and that it's in your path
  </p>

</div>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/Velkee/praxisDB.svg?style=for-the-badge
[contributors-url]: https://github.com/Velkee/praxisDB/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Velkee/praxisDB.svg?style=for-the-badge
[forks-url]: https://github.com/Velkee/praxisDB/network/members
[stars-shield]: https://img.shields.io/github/stars/Velkee/praxisDB.svg?style=for-the-badge
[stars-url]: https://github.com/Velkee/praxisDB/stargazers
[issues-shield]: https://img.shields.io/github/issues/Velkee/praxisDB.svg?style=for-the-badge
[issues-url]: https://github.com/Velkee/praxisDB/issues
[license-shield]: https://img.shields.io/github/license/Velkee/praxisDB.svg?style=for-the-badge
[license-url]: https://github.com/Velkee/praxisDB/blob/master/LICENSE.txt
