$(document).ready( function(){
  const container = $('#container');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  let width;
  let height;

  updateViewportSize();

  $(window).resize(function(){
    updateViewportSize();
  });





  function updateViewportSize(){
    width = $(window).width();
    height = $(window).height();

    container.css('background-image',"url(background.png)")
    if(width >= 854 && height >= 480) {
      container.css('background-size', `${width}px ${height}px`);
    }
    else {
      container.css('background-size', `854px 480px`);
    }

    canvas.height = height/1.61;
    canvas.width = canvas.height;
    context.fillStyle = 'yellow';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
});
