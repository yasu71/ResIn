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
    const $title = $('<p>').text(resource.title).addClass('resource-title');
    const $image = $('<img>').attr("src", resource.img_url).addClass('img-url');
    const $url = $('<p>').text(resource.url).addClass('new-url');
    const $description = $('<p>').text(resource.description).addClass('resource-desc');
    const $rating = $('<div>').addClass('starrr').attr({
      id: 'star1',
    }).starrr();
    //const $rating = $('<p>').text(resource.rating + '/5 rating').addClass('resource-rating');
    const $footer = $('<p>').addClass('resource-footer');
    const $footerspan = $('<span>').addClass('icons');
    const $heart = $('<i>').addClass('fa fa-heart');

    $footerspan.append($heart);
    $footer.append($rating, $footerspan);
    $article.append($image, $title, $url, $description, $footer);

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
