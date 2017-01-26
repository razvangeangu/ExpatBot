# ExpatBot

ExpatBot is an artificial intelligence chat bot for Hackathon Quai d'Orsay numérique. The application is a web-based app for french people in need for help from [The French Ministry of Foreign affairs - Quai d'Orsay](http://www.diplomatie.gouv.fr/en/)

The bot responds to querries written or spoken in french and here are some examples:
  - où est l'ambassade d'Allemagne
  - quels sont les ecoles en espagne
  - chocs des cultures

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

MIT License

**Copyright (c) 2017** *Ana-Maria Voicilă, Constantin Armeniades, Jérôme de Chillaz, Leo Amsellem, Louis de Valbray, Lukas Ondrej, Răzvan-Gabriel Geangu, Sixte de Maupeou*

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



   [React]: <https://facebook.github.io/react/>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
