

const container = $('#container');
const canvas = document.getElementById('canvas');
//const context = canvas.getContext('2d');

let width;
let height;

updateViewportSize();

class Screen {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
  }

  update() {

  }

  draw() {

  }

  resize() {

  }
}

class MenuScreen extends Screen {
  constructor(canvas) {
    super(canvas);
    this._background = document.createElement('img');
    this._background.src = 'menu.jpg';
    this._cursor = document.createElement('img');
    this._cursor.src = 'cursor.jpg';
    this._music = document.createElement('audio');
    this._music.src = 'menu.mp3';

    this._music.play();
  }
  update() {

  }

  draw() {
    this._context.drawImage(this._background, 0, 0, this._canvas.width, this._canvas.height);
  }

  resize() {

  }
}

class Game {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this._currentScreen = new MenuScreen(this._canvas);

    this.lastFrameTimeMs = 0;
    this.delta = 0;
    this.maxFps = 60;
    this.timestep = 1000 / 60;

    this.gameLoop = this.gameLoop.bind(this);
  }



  update(delta) {

  }

  draw() {
    this._currentScreen.draw();
  }

  gameLoop(timestamp) {
    if (timestamp < this.lastFrameTimeMs + (1000 / this.maxFps)) {
      requestAnimationFrame(this.gameLoop);
      return;
    }
    this.delta += timestamp - this.lastFrameTimeMs;
    this.lastFrameTimeMs = timestamp;

    while (this.delta >= this.timestep) {
      this.update(this.timestep);
      this.delta -= this.timestep;
    }
    this.draw();
    requestAnimationFrame(this.gameLoop);
  }

  start() {
    requestAnimationFrame(this.gameLoop);
  }
}

const game = new Game(canvas);
game.start();

$(window).resize(function() {
  updateViewportSize();
});

/*
function update(delta) {

}

function draw() {

}

function mainLoop(timestamp) {
  // Throttle the frame rate.
  if (timestamp < lastFrameTimeMs + (1000 / maxFps)) {
    requestAnimationFrame(mainLoop);
    return;
  }
  delta += timestamp - lastFrameTimeMs;
  lastFrameTimeMs = timestamp;

  while (delta >= timestep) {
    update(timestep);
    delta -= timestep;
  }
  draw();
  requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
*/
//

function updateViewportSize() {
  width = $(window).width();
  height = $(window).height();

  container.css('background-image', "url(background.png)")
  if (width >= 854 && height >= 480) {
    container.css('background-size', `${width}px ${height}px`);
  } else {
    container.css('background-size', `548px 480px`);
  }

  canvas.height = height / 1.61;
  canvas.width = canvas.height * 8 / 7;

  //console.log(`${canvas.width} ${canvas.height}`);
  //context.fillRect(0, 0, canvas.width, canvas.height);
}
