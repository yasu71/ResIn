$(() => {

  const searchResource = function(input) {
    const query = `search=${input}`;
    $.getJSON('/resources/search', query)
      .then((results) => {
        renderResources(results);
      });
  };

  const renderResources = function(results) {
    $('#resource-container').empty();

    for (const resource of results['resources']) {
      let $resource = createResElement(resource);
      $('#resource-container').append($resource);
    }

    //// START Add category with dropdown(s)
    $('#resource-container').on('change', '.categorySelect', function (event) {
      const getResourceId = $(this).closest('.loaded-resource').attr("id")

      const selectedCategoryId = $(`option:selected`, $(this)).val();
      event.preventDefault();

      const getCategory = (categoryChoice) => {
        $.getJSON('/categories')
        .then((categories) => {
          for (const category of categories) {
            if (category.id == categoryChoice) {
              for (const resource of results['resources']) {
                if (resource.id == getResourceId) {
                $.post(`/resources/user/${resource.user_id}/category/${categoryChoice}`,{resourceId: getResourceId});
                return renderCategories($(this), category.name);
                }
              }
            }
          }
        });
      }
      getCategory(selectedCategoryId)
    });

    //Shows category tag and hide dropdown
    const renderCategories = ($select, result) => {
      container = $select.closest('.category-container')
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
      $heart = $(this)
      $heart.css("color", "pink")

      let articleId = $heart.closest('.loaded-resource').attr('id');

      for (const resource of results['resources']) {
        if(resource.id == articleId){
          $.post(`/resources/user/${resource.user_id}/resource/${articleId}`);
        }
      }
    })
    //// END Like/Heart turns to pink

    //// START ratings sending to router
    // $('#resource-container').on('click.starrr', 'a', function(event) {
    //   $star = $(this)
    //   console.log($star);
    //   // $heart.css("color", "pink")

    //   getResourceId

      // for (const resource of results['resources']) {
      //   if(resource.id == getResourceId){
      //     $.post(`/resources/user/${resource.user_id}/${articleId}`);
      //   }
      // }
    // })
    //// END ratings sending to router

  };

  // create HTML elements of resourse cards that includes a search keyword
  const createResElement = function(resource) {
    const $article = $('<article>').addClass('loaded-resource').attr("id", resource.id);
    const $title = $('<p>').text(resource.title).addClass('resource-title');
    const $image = $('<img>').attr("src", resource.img_url).addClass('img-url');
    const $url = $('<p>').text(resource.url).addClass('new-url');
    const $description = $('<p>').text(resource.description).addClass('resource-desc');
    const $rating = $('<div>').addClass('starrr').attr({
      id: 'star1',
    },).starrr();
    //const $rating = $('<p>').text(resource.rating + '/5 rating').addClass('resource-rating');
    const $footer = $('<p>').addClass('resource-footer');
    const $heartContainer = $('<div>').addClass('heart-container')
    const $heart = $('<i>').addClass('fa fa-heart').attr("id", `heart-${resource.id}`);

    //// START adding category dropdown
    ////// conditions for categories whether resource already has a category tag or not
    // if (resource.category_id) {
    //   $category = renderCategory()
    // }
    // else {
    //   $category = renderCategoryDropdown()
    // }
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
    const $input = $("<input>").attr("type", "hidden").attr("name", "resource_id").attr("value", resource.id);
    const $categoryForm = $("<form>").attr("action", `/resource/user/${resource.user_id}`).attr("method", "POST");
    const $div =$("<div>").attr("id", "demo");
    const $categoryDropdown = $("<div>").addClass("category-container").attr("id", "container-hide");
    //// END adding category dropdown

    $dropdownSelect.append($addCategoryLabel, $javascript, $ruby, $python, $C, $css, $sql, $java, $jQuery, $html, $bash, $rust);
    $categoryForm.append($dropdownSelect, $input);
    $categoryDropdown.append($categoryForm);
    $footer.append($rating);
    $heartContainer.append($heart);
    $article.append($image, $title, $url, $description, $footer, $heartContainer, $categoryDropdown, $div);

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
