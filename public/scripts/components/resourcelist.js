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
    $footer.append($footerspan, $rating);
    $article.append($image, $title, $url, $description, $footer);

    return $article;

  };

});
