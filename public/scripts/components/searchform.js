$(() => {

  const $form = $('#resource-search');

  $form.on('submit', (event) => {
    event.preventDefault();
    const data = $('#search-input').val();
    searchResource(data);
  });
});

