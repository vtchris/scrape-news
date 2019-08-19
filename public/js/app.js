$(".js_saveArticle").on("click", function(e) {
    
    e.preventDefault();

    // Get aticle id
    var id = $(this).parents(".card").data("id")

    // API to save the article to mongo     
    $.post("/articles/" + id).then(function(res){
        console.log(res)
    })
        
  });