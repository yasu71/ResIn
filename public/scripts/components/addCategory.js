$(() => {
  console.log('This is add existing category');

  const selectedCategory = select => {
    const query = `category=${select}`;
    $.getJSON('/resources/user/:userid/category', query)
      .then((results) => {
        renderCategories(results);
      });
  };

  const renderCategories = results => {
    $('.category-container').empty();
    // console.log(results['categories'])

    for (const category of results['categories']) {
      let $category = createNewCategory(category);
      $('.category-container').append($category);
    }
  };

  const createNewCategory = category => {
    const $newCategory = $('<div>').addClass('new-category').text(category.name);
    return $newCategory;
  };

  const $form = $('.category > form');

  $form.on('submit', (event) => {
    event.preventDefault();
    const data = $(`${form} > option:selected`).val();
    console.log(data)
    selectedCategory(data);
  });

});
