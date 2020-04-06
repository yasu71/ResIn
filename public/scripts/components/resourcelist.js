$(() => {

  // console.log('This is search form');
  // User id retreieved from cookie users.js
  const getUserId = () => {
    $.getJSON('/users/me')
      .then((value) => {
        loadResource(value);

      });
  };

  // Populating the resources list for individual user by calling function in getUserId
  const loadResource = function(user_id) {

    $.getJSON(`/resources/user/${user_id}`)
      .then((results) => {
        // console.log(results)
        renderResources(results);
      });
  };

  getUserId();

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

  };

});
