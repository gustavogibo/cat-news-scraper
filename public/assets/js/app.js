$(document).ready(function() {

    $(".scrape-data").on("click", function() {
        
    });

    $(".bt-toggle-article").on("click", function (event) {
        
        event.preventDefault();

        if($(this).attr("data-value") == "true") {

            var values = {
                id: $(this).attr("data-id"),
                val: 1
            };

            $(this).text(`Unsave article`);
            $(this).addClass(`btn-danger`);
            $(this).removeClass(`btn-info`);
            $(this).attr(`data-value`, "false");

        } else {

            var values = {
                id: $(this).attr("data-id"),
                val: 0
            };

            $(this).text(`Save article`);
            $(this).removeClass(`btn-danger`);
            $(this).addClass(`btn-info`);
            $(this).attr(`data-value`, "true");

        }

        $.ajax({
            method:"POST",
            url: "/api/togglearticle",
            data: values
        })
        .then(function(data) {

            var situation;

            if(data.saved) {

                situation = "saved";

            } else {
                situation = "unsaved";
            }

            swal(
                'Success!',
                `Article ${situation}!`,
                'success'
            );

            console.log(data.saved);

        });
    
    })

})