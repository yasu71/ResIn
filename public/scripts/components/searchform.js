$(() => {

    //// END Add category with dropdown(s)

  //// START Like/Heart turns to pink

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

  const $form = $('#resource-search');

  $form.on('submit', (event) => {
    event.preventDefault();
    const data = $('#search-input').val();
    console.log(data);
    searchResource(data);
  });

});
// Select resource_id, avg(rating) from "public"."ratings" group by resource_id
