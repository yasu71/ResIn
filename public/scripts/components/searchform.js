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
    console.log(results['resources'])

    for (const resource of results['resources']) {
      console.log("resource: ", resource)
      let $resource = createResElement(resource);
      $('#resource-container').append($resource);
    }

    // change event handler to category dropdown(s)
    const $form = $(".categorySelect");

    const $resourseId = $form.parent().parent().parent().attr('id')

    $($form).change((event) => {
      const selectedCategoryId = $(`option:selected`, $form).val();
      event.preventDefault();
      // $(`option:selected`, $form).val() ==> returns to selected value from dropdown

      const getCategory = (categoryChoice) => {
        $.getJSON('/categories')
        .then((categories) => {
          for (const category of categories){
            // console.log("categories: ", categories)
            // console.log("categoryChoice: ", categoryChoice)
            if (category.id == categoryChoice){
              $.post(`/resources/user/1/${categoryChoice}`);
              return renderCategories(category.name);
              }
            }
          });
        }
      getCategory(selectedCategoryId)
    });

    const renderCategories = results => {
      $('.category-container').empty();
      let $category = createNewCategory(results);
      $('.category-container').append($category);
    };

    const createNewCategory = category => {
      const $newCategory = $('<div>').addClass('new-category').text(category);
      return $newCategory;
    };

    //// START Like/Heart turns to pink
    let $articleId = $('.fa-heart').closest('.loaded-resource').attr('id');

    $(`#${$articleId} > div > .fa-heart`).click(() => {
      $(`#${$articleId} > div > .fa-heart`).css("color", "pink");
      for (const resource of results['resources']) {
        if(resource.id == $articleId){
          $.post(`/resources/user/${resource.user_id}/${$articleId}`, $articleId);
        }
      }
    })
    //// END Like/Heart turns to pink

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
    const $footerspan = $('<span>').addClass('icons');
    const $heartContainer = $('<div>').addClass('heart-container')
    const $heart = $('<i>').addClass('fa fa-heart').attr("id", `heart-${resource.id}`);

    // START adding category dropdown
    ////// if category already has a category tag, show the tag
    // if (resource.category_id) {
    //   $category = renderCategory()
    // }
    ////// if resources don't have a category tag yet, show dropdown
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
    const $dropdownSelect = $("<select>").addClass("categorySelect").attr("name", "category");
    const $input = $("<input>").attr("type", "hidden").attr("name", "resource_id").attr("value", resource.id);
    const $categoryForm = $("<form>").attr("action", `/resource/user/${resource.user_id}`).attr("method", "POST");
    const $div =$("<div>").attr("id", "demo");
    const $categoryDropdown = $("<div>").addClass("category-container").attr("id", "container-hide");
    // END adding category dropdown

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
