// DOM variables
const $saveNote = $("#save-note-btn");
const $notesModal = $("#notes-modal");
const $notesTitle = $("#notes-title");
const $notesUL = $("#notes-ul");

$(".js_addNote").on("click", function (e) {

  e.preventDefault();

  const id = $(this).parent().attr("data-id");

  $.get("/articles/" + id).then(function (res) {

    $notesUL.empty();
    const notes = res.note

    $notesTitle.text(res.title);

    for (let i = 0; i < notes.length; i++) {
      let li = $("<li>");
      let btn = $("<button>");
      li.addClass("d-flex mb-2")
      li.text(notes[i].text);
      btn.addClass("btn btn-sm btn-danger mr-2 js_deleteNote")
      btn.html("<span class='fa fa-window-close'></span>")
      btn.attr("id", notes[i]._id)
      btn.prependTo(li)

      //Append new li
      li.appendTo($notesUL);
    }
    //Add click handlers to new delete buttons
    $(".js_deleteNote").on("click", function (e) {
    
      e.preventDefault();
    
      $.ajax({
        url: "/notes/" + this.id,
        method: "DELETE"
      }).then(res, function () {
        console.log(res)
      })
    
    })
    $saveNote.attr("data-id", id);
    $notesModal.modal("show");

  })
})
$(".js_saveArticle").on("click", function (e) {

  e.preventDefault();

  // Get aticle id
  var id = $(this).parents(".card").data("id")

  // API to save the article to mongo     
  $.post("/articles/" + id).then(function (res) {
    console.log(res)
  })
});
$("#save-note-btn").on("click", function (e) {

  e.preventDefault();

  const articleId = $(this).attr("data-id")

  $.ajax({
    method: "POST",
    url: "/notes/" + articleId,
    data: {
      // Value taken from title input
      //title: $("#titleinput").val(),  
      articleId: articleId,
      text: $("#note-txt").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#note-txt").empty();
    });
 
})
