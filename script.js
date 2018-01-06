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

  container.css('background-image', "url(src/assets/images/background.png)")
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

  update(clicked) {

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
    this._background.src = 'src/assets/images/menu.jpg';
    this._cursor = document.createElement('img');
    this._cursor.src = 'src/assets/images/cursor.jpg';
    this._music = document.createElement('audio');
    this._music.src = 'src/assets/sfx/menu.mp3';

    this.over = false;

    this.inputRect;
    this.modeFlag = true;
    this.upperInputRect = new Rect(this._canvas.width / 4.0, this._canvas.height / 1.555555,
      this._canvas.width / 2, this._canvas.height / 28);
    this.lowerInputRect = new Rect(this._canvas.width / 4.0, this._canvas.height / 1.4,
      this._canvas.width / 2, this._canvas.height / 28);
    this._music.play();
  }
  update(clicked) {
    if (this.upperInputRect.contains(game.playerPos.x, game.playerPos.y)) {
      this.inputRect = this.upperInputRect;
      this.modeFlag = true;
    }
    else if (this.lowerInputRect.contains(game.playerPos.x, game.playerPos.y)) {
      this.inputRect = this.lowerInputRect;
      this.modeFlag = false;
    }

    if(clicked && this.inputRect != null) {
      this.over = true;
      this._music.pause();
    }
  }

  draw() {
    this._context.drawImage(this._background, 0, 0, this._canvas.width, this._canvas.height);
    if(this.inputRect != null){
      this._context.drawImage(this._cursor,
        this.inputRect.x - this.inputRect.height * 2,
        this.inputRect.y,
        this.inputRect.height,
        this.inputRect.height);
    }
  }

  resize() {

  }
}

class Game {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this.currentScreen = new MenuScreen(this._canvas);

    this.lastFrameTimeMs = 0;
    this.delta = 0;
    this.maxFps = 60;
    this.timestep = 1000 / 60;

    this.clicked = false;
    this.playerPos = {
      x: 0,
      y: 0
    };

    this.gameLoop = this.gameLoop.bind(this);
  }

  update(delta) {
    this.currentScreen.update(this.clicked);
    if(this.clicked) {
      this.clicked = false;
    }
    if(this.currentScreen.over){
      this.currentScreen = new MenuScreen(this._canvas);
    }
  }

  draw() {
    this.currentScreen.draw();
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

$(canvas).on('mousemove', evt => {
  let clientRect = canvas.getBoundingClientRect();
  game.playerPos.x = evt.clientX - clientRect.left;
  game.playerPos.y = evt.clientY - clientRect.top;
});

$(canvas).on('click', evt => {
  game.clicked = true;
});
