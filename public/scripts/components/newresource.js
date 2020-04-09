$(() => {
  console.log('this is the newresource')
  const $form = $('#resource-form');
  const $newresource = $('#addresource-down');
  const $submitresource = $('#new-resource')


  const getUserId = () => {
    $.getJSON('/users/me')
      .then((value) => {
        loadResources(value);

      });
  };

  const loadResources = function(user_id) {

    $.getJSON(`/resources/user/${user_id}`)
      .then((results) => {
        // console.log(results)
        renderResource(results);
      });
  };

  getUserId();

  // For each resource the page will be reloaded with the current tweets and new one appended
  const renderResource = function(results) {
    $('#resource-container').empty();
    // console.log(results['resources'])

    for (const resource of results['resources']) {
      let $resource = createResElement(resource);
      $('#resource-container').append($resource);
    }
  };

  const createResElement = function(resource) {
    const $article = $('<article>').addClass('loaded-resource');
    const $title = $('<p>').text(resource.title).addClass('resource-title');
    const $image = $('<img>').attr("src",resource.img_url).addClass('img-url');
    const $url = $('<p>').text(resource.url).addClass('new-url');
    const $description = $('<p>').text(resource.description).addClass('resource-desc');
    const $rating = $('<div>').addClass('starrr').attr({
      id: 'star1',
    }).starrr();
    const $footer = $('<p>').addClass('resource-footer');
    const $footerspan = $('<span>').addClass('icons');
    const $heart = $('<i>').addClass('fa fa-heart');

    $footerspan.append($heart);
    $footer.append('<br>', $footerspan, $rating);
    $article.append($image, $title, $url, $description, $footer);

    return $article;

  };

  // Submit request for the tweet
  $form.on('submit', (event) => {

    // prevent default behaviour of HTML post method and ACTION and will post below using ajax
    event.preventDefault();

    // Form data formatted into query string using serialize
    const formInfo = $form.serialize();
    console.log(formInfo)

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
    $('#new-resource').slideToggle(400);
  });

});
