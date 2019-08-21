const $saveNote = $("#save-note-btn");
const $notesModal = $("#notes-modal");

$(".js_saveArticle").on("click", function (e) {

  e.preventDefault();

  // Get aticle id
  var id = $(this).parents(".card").data("id")

  // API to save the article to mongo     
  $.post("/articles/" + id).then(function (res) {
    console.log(res)
  })

});
$(".js_addNote").on("click", function (e) {

  e.preventDefault();

  $saveNote.attr("data-id", $(this).parent().attr("data-id"));
  $notesModal.modal("show");

})
$("#save-note-btn").on("click", function (e) {

  e.preventDefault();

  const articleId = $(this).attr("data-id")
 
  $.ajax({
    method: "POST",
    url: "/notes/" + articleId,
    data: {
      // Value taken from title input
      //title: $("#titleinput").val(),  
      body: $("#note-txt").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#note-txt").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  //   $("#titleinput").val("");
  //   $("#bodyinput").val("");
})