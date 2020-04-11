const getUserId = () => {
  $.getJSON('/users/me')
    .then((value) => {
      loadResource(value);
    });
};

const loadResource = function(user_id) {
  $.getJSON(`/resources/user/${user_id}`)
  .then((results) => {
      renderResources(results);
      console.log("results", results);
    });
};

const renderResources = function(results) {
  $('#resource-container').empty();
  //console.log(results['resources'])
  for (const resource of results['resources']) {
    let $resource = createResElement(resource);
    $('#resource-container').append($resource);

  }
  //// START Add category with dropdown(s)
  $('#resource-container').on('change', '.categorySelect', function(event) {
    const getResourceId = $(this).closest('.loaded-resource').attr("id");
    const selectedCategoryId = $(`option:selected`, $(this)).val();
    event.preventDefault();

    const getCategory = (categoryChoice) => {
      $.getJSON('/categories')
        .then((categories) => {
          for (const category of categories) {
            if (category.id == categoryChoice) {
              for (const resource of results['resources']) {
                if (resource.id == getResourceId) { $.getJSON('/users/me')
                  .then((userId) => {
                    $.post(`/resources/user/${userId}/category/${categoryChoice}`,{resourceId: getResourceId});
                    return renderCategories($(this), category.name);
                  });
                }
              }
            }
          }
        });
    };
    getCategory(selectedCategoryId);
  });

  //Shows category tag and hide dropdown
  const renderCategories = ($select, result) => {
    container = $select.closest('.category-container');
    container.empty();
    let $category = createNewCategory(result);
    container.append($category);
  };

  //Created category tag
  const createNewCategory = category => {
    const $newCategory = $('<div>').addClass('new-category').text(category);
    return $newCategory;
  };

  //// END Add category with dropdown(s)
  //// START Like/Heart turns to pink
  $('#resource-container').on('click', '.fa-heart', function(event) {
    $heart = $(this);
    $heart.css("color", "pink");
    let articleId = $heart.closest('.loaded-resource').attr('id');
    for (const resource of results['resources']) {
      if (resource.id == articleId) {
        $.getJSON('/likes')
          .then((likes) => {
            if (!likes.resource_id) {
              $.getJSON('/users/me')
                .then((userId) => {
                  $.post(`/resources/user/${userId}/resource/${articleId}`);
                });
            }
          });
      }
    }
  });
  //// END Like/Heart turns to pink
};

const createResElement = function(resource) {
  const resourceId = resource.id;
  //console.log(resourceId)
  const $article = $('<article>').addClass('loaded-resource').attr("id", resource.id);
  const $title = $('<p>').addClass('resource-title');
  const $titleLink = $('<a>').attr('href', resource.url).attr("target", "_blank").addClass('source-url').text(resource.title);
  const $imgDiv = $('<div>').addClass('img-container');
  const $imgATag = $('<a>').attr('href', resource.url).attr("target", "_blank").addClass('source-url');
  const $image = $('<img>').attr("src",resource.img_url).addClass('img-url');

  const $imageOverlay = $('<div>').addClass('img-overlay');
  const $overlayText = $('<div>').addClass('overlayText').text('Go to Resource Page');
  const $commenticon = $('<i>').addClass('fa fa-comments').attr('aria-hidden', 'true');

  const $url = $('<p>').text(resource.url).addClass('new-url');
  const $description = $('<p>').text(resource.description).addClass('resource-desc');
  const $footer = $('<p>').addClass('resource-footer');

  // Comment elements
  const $comment = $('<textarea>').addClass('comment-text').attr('placeholder', 'Add Comment Here').attr('name', 'comment_box');
  const $commentbtn = $('<button>').addClass('comment-btn').text('SUBMIT').attr('type', 'submit');
  const $formcomment = $('<form>').attr('id', 'comment-form').attr('method', 'POST').attr('action', '/comments').addClass('comment-form');
  const $postedcomment = $('<div>');
  const $hiddenresource = $('<input>').hide().attr("value", resource.id).attr('name', "resource_id");


  // Comment retrieval
  $.getJSON(`/comments/resource/${resourceId}`)
    .then((results) => {
      for (const data of results.reverse()) {
        $postedcomment.append($('<p>').text(data.comment).addClass('posts'));

      }
    });

  $('#resource-container').one('submit', '.comment-form', function(event) {
    event.preventDefault();

    $myform = $(this);
    let articleId = $myform.closest('.loaded-resource').attr('id');
    if (resource.id == articleId) {
      const formInfo = $myform.serialize();

      $.post('/comments', formInfo)
        .then((response) => {
          getUserId();
          $('.comment-text').val("");
        });
    }
  });

  $('#resource-container').on('click', '.fa-comments', function(event) {
    $myicon = $(this);
    let articleId = $myicon.closest('.loaded-resource').attr('id');
    if (resource.id == articleId) {
      $myicon.siblings('.comment-form').show();
    }
  });

  //// START adding ratings elements with condition
  $.getJSON(`/users/me`)
    .then((userId) => {
      $.getJSON('/ratings')
        .then((ratings) => {
          let $ratingDiv = $('<div>');
          for (let rating of ratings) {
            if (resource.id === rating.resource_id) {
              if (userId === rating.user_id) {
                $($ratingDiv).addClass('starrr').attr({
                  id: 'star1',
                }).starrr({rating: resource.rating});
                $footer.append($ratingDiv);
              }
            }
          }
          $($ratingDiv).addClass('starrr').attr({
            id: 'star1',
          }).starrr({});
          $footer.append($ratingDiv);
        });
    });
  //// END ////

  //// START Elements adding for Likes/Heart with condition. Only a user's Like is coloured to pink.

  const $heartContainer = $('<div>').addClass('heart-container');
  const $heart = $('<i>').addClass('fa fa-heart').attr("id", `heart-${resource.id}`);
  $.getJSON('/likes')
    .then((likes) => {
      for (const like of likes) {
        $.getJSON(`/users/me`)
          .then((userId) => {
            if (resource.id === like.resource_id && userId === like.user_id) {
              $heart.css("color", "pink");
              $heartContainer.append($heart);
            } else {
              $heartContainer.append($heart);
            }
          });
      }
    });
  //// END ////

  //// START Elements adding for category dropdown with condition. If cateogory already assigned to resources, category tag shows
  const $categoryDropdown = $("<div>").addClass("category-container").attr("id", "container-hide");
  if (resource.category_id) {
    $.getJSON('/categories')
      .then((categories) => {
        for (const category of categories) {
          if (resource.category_id == category.id) {
            const $newCategory = $('<div>').addClass('new-category').text(category.name);
            $categoryDropdown.append($newCategory);
          }
        }
      });
  } else {
    const $rust = $("<option>").attr("value", 11).text("Rust");
    const $bash = $("<option>").attr("value", 10).text("Bash");
    const $html = $("<option>").attr("value", 9).text("HTML");
    const $jQuery = $("<option>").attr("value", 8).text("JQuery");
    const $java = $("<option>").attr("value", 7).text("Java");
    const $sql = $("<option>").attr("value", 6).text("SQL");
    const $css = $("<option>").attr("value", 5).text("CSS");
    const $C = $("<option>").attr("value", 4).text("C++");
    const $python = $("<option>").attr("value", 3).text("python");
    const $ruby = $("<option>").attr("value", 2).text("ruby");
    const $javascript = $("<option>").attr("value", 1).text("Javascript");
    const $addCategoryLabel = $("<option>").attr("value", 0).text("Add Category");
    const $dropdownSelect = $("<select>").addClass("categorySelect").attr("name", 'category');
    $dropdownSelect.append($addCategoryLabel, $javascript, $ruby, $python, $C, $css, $sql, $java, $jQuery, $html, $bash, $rust);

    const $input = $("<input>").attr("type", "hidden").attr("name", "resource_id").attr("value", resource.id);
    const $categoryForm = $("<form>").attr("action", `/resource/user/${resource.user_id}`).attr("method", "POST");
    $categoryForm.append($dropdownSelect, $input);

    const $div =$("<div>").attr("id", "demo");
    $article.append($div);
    $categoryDropdown.append($categoryForm).addClass('dropdown-cat');
    $categoryForm.append($dropdownSelect, $input);
  }
  //// END ////

  $formcomment.append($comment, $hiddenresource, '<br>', $commentbtn);
  $heartContainer.append($heart);

  $imageOverlay.append($overlayText);
  $imgATag.append($image, $imageOverlay);
  $imgDiv.append($imgATag);
  $title.append($titleLink);
  $article.append($imgDiv, '<br>', $heartContainer, $commenticon, $title, $url, $description,  $footer, $categoryDropdown, '<br>', $formcomment, '<br>', $postedcomment);


  return $article;
};


// Passing through search keyword data from endpoint to renderResources
const searchResource = function(input) {
  const query = `search=${input}`;

  $.getJSON('/resources/search', query)
    .then((results) => {
      $('#resource-container').off();
      renderResources(results);
    });
};

