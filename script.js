$(document).ready( function(){
  const container = $('#container');

  let width;
  let height;

  updateViewportSize();

  console.log(container.css('background-image'));

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
  }
});
