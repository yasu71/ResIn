$(() => {
  console.log('in the addcomment at top')
  const $form = $('#comment-form');
  //const $submitresource = $('.comment-btn');

  $form.on('submit', (event) => {
    event.preventDefault();

    const formInfo = ('#comment-form').val();
    console.log('this is in the form event for comments');

    $.post('/comments', formInfo)
      .then((response) => {
        getUserId();
        $('.comment-text').val("");
      });

      res.redirect('/resources');
    });





});
