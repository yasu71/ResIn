$(() => {

  const $form = $('#resource-form');
  const $newresource = $('#addresource-down');

  // Submit request for the tweet
  $form.on('submit', (event) => {
    event.preventDefault();
    const formInfo = $form.serialize();

    $.post('/resources', formInfo)
      .then((response) => {
        getUserId();
        $('#resources-img').val("");
        $('#resources-url').val("");
        $('#resources-title').val("");
        $('#resources-description').val("");
      });
    $('#new-resource').slideUp(400);
  });

  $newresource.on('click', (event) => {
    $('#new-resource').slideToggle(300);
  });
});
