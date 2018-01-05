const container = $('#container');
let width;
let height;
const canvas = document.getElementById('canvas');
updateViewportSize();

$(window).resize(function() {
  updateViewportSize();
});

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
}

//////////////////////////////////////////////////////////

class Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(x, y) {
    return x >= this.x && x <= this.x + this.width &&
      y >= this.y && y <= this.y + this.height;
  }
}

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

    this.mode1Flag = false;
    this.mode2Flag = false;
    this.inputRect = new Rect(this._canvas.width / 4.0, this._canvas.height / 1.555555,
      this._canvas.width / 2, this._canvas.height / 28);
    this.lowerInputRect = new Rect(this._canvas.width / 4.0, this._canvas.height / 1.4,
      this._canvas.width / 2, this._canvas.height / 28);
    this._music.play();
  }
  update() {
    if (this.inputRect.contains(game.playerPos.x, game.playerPos.y)) {
      this.mode1Flag = true;
      this.mode2Flag = false;
    } else if (this.lowerInputRect.contains(game.playerPos.x, game.playerPos.y)) {
      this.mode1Flag = false;
      this.mode2Flag = true;
    } else {
      this.mode1Flag = false;
      this.mode2Flag = false;
    }
  }

  draw() {
    this._context.drawImage(this._background, 0, 0, this._canvas.width, this._canvas.height);
    if (this.mode1Flag) {
      this._context.drawImage(this._cursor,
        this.inputRect.x - this.inputRect.height * 2,
        this.inputRect.y,
        this.inputRect.height,
        this.inputRect.height);
    } else if (this.mode2Flag) {
      this._context.drawImage(this._cursor,
        this.lowerInputRect.x - this.lowerInputRect.height * 2,
        this.lowerInputRect.y,
        this.lowerInputRect.height,
        this.lowerInputRect.height);
    }
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

    this.playerPos = {
      x: 0,
      y: 0
    };

    this.gameLoop = this.gameLoop.bind(this);


    $(this._canvas).on('mousemove', evt => {
      let clientRect = this._canvas.getBoundingClientRect();
      this.playerPos.x = evt.clientX - clientRect.left;
      this.playerPos.y = evt.clientY - clientRect.top;
    });
  }

  update(delta) {
    this._currentScreen.update();
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

const game = new Game(document.getElementById('canvas'));
game.start();
