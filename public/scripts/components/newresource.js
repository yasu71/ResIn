$(() => {
  // console.log('this is the newresource')
  const $form = $('#resource-form');
  const $newresource = $('#addresource-down');
  const $submitresource = $('#new-resource')

  // Submit request for the tweet
  $form.on('submit', (event) => {

    // prevent default behaviour of HTML post method and ACTION and will post below using ajax
    event.preventDefault();

    // Form data formatted into query string using serialize
    const formInfo = $form.serialize();
    // console.log('this is in the newresource ', formInfo)

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
