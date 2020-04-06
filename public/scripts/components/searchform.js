$(() => {
  // console.log('This is search form');

  const searchResource = function(input) {
    const query = `search=${input}`;
    $.getJSON('/resources/search', query)
      .then((results) => {
        renderResources(results);
      });
  };

  const renderResources = function(results) {
    $('#resource-container').empty();
    // console.log(results['resources'])

    for (const resource of results['resources']) {
      let $resource = createResElement(resource);
      $('#resource-container').append($resource);
    }
  };

  const createResElement = function(resource) {
    const $article = $('<article>').addClass('loaded-resource');
    const $title = $('<p>').text(resource.title);
    const $url = $('<p>').text(resource.url);
    const $description = $('<p>').text(resource.description);
    const $rating = $('<p>').text(resource.rating);
    const $heart = $('<i>').addClass('fa fa-heart');

    $article.append($title, $url, $description, $rating, $heart);

    return $article;

  }

  const $form = $('#resource-search');

  $form.on('submit', (event) => {

    event.preventDefault();
    const data = $('#search-input').val();
    console.log(data)
    searchResource(data);
  });

});
