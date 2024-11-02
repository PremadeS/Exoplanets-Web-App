# ExoPlanets Web App

An *interactive* spaceship game aimed at younger students to deliver information about **exoplanets** in an entertaining way *(note that this is just a base for an idea not a fully developed game **yet**)*! 

You can *check* the **Demo** here: [Exoplanets-Galaxar-Web](https://exoplanets-galaxar.vercel.app/) (***please*** do not run it on mobile devices *thank you*)

use **WASD** to move *btw*

**Database** currently only has a few test planets and **backend** is configured for *localhost*!

## To Run

```shell
git clone https://github.com/PremadeS/Exoplanets-Web-App
cd Exoplanets-Web-App
```

### Server:

```shell
cd backend
npm install
node server.js
```

The *server* will run on port **3000** by default

```javascript
const PORT = 3000;
```

*can change this to any port in **server.js***

### Frontend:

```shell
cd frontend
npm install
npm run dev
```

## Note:

The database folder contains a **planets.sql** file with data about *5 exoplanets* for testing, make sure to run the *database* first before running the ***server*** and ***app***. On **Linux** you can start the database using 

```shell
sudo systemctl start mysql
```

*or any other equivalent command (might also need to replace **mysql** with **mariadb** on some distros like **kali**)*