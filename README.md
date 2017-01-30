# ExpatBot

ExpatBot is an artificial intelligence chat bot for Hackathon Quai d'Orsay numérique. The application is a web-based app for french people in need for help from [The French Ministry of Foreign affairs - Quai d'Orsay](http://www.diplomatie.gouv.fr/en/)

The bot responds to querries written or spoken in french and here are some examples:
  - où est l'ambassade d'Allemagne
  - quels sont les ecoles en espagne
  - chocs des cultures
  
[Watch presentation here](https://www.facebook.com/france.diplomatie/videos/10154818132763260/)
[logo]: /Screenshot.png "Screenshot"

### Tech

ExpatBot uses a number of open source projects to work properly:

* [React] - a declarative, efficient, and flexible JavaScript library for building user interfaces
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]

The project can be found here [public repository][git-repo-url] on GitHub.

### Installation

ExpatBot requires [Node.js](https://nodejs.org/) v4+ to run.

To start the app you have to change the host in the [bundle.js](/static/bundle.js) file.
```js
localhost:80
```

Start the server.
```sh
$ sudo node app.js
```

License
----

[MIT License](/LICENSE)

**Copyright (c) 2017** *Ana-Maria Voicilă, Constantin Armeniades, Jérôme de Chillaz, Leo Amsellem, Louis de Valbray, Lukas Ondrej, Răzvan-Gabriel Geangu, Sixte de Maupeou*



   [React]: <https://facebook.github.io/react/>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
