$(document).ready(function() {

    $(".scrape-data").on("click", function() {
        swal.showLoading({title: 'Looking for Mew Mew articles'});
        $.ajax({
            method:"GET",
            url: "/scrape"
        }).then(function (data) {

            swal(
                'Scraping complete',
                `New cats here!`,
                'success'
            );

        })

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
    
    });

    $(".btn-note").on("click", function(event) {

        event.preventDefault();

        var id = $(this).attr("data-id");

        swal.showLoading({title: 'Looking for Mew Mew articles'});

        $.ajax({
            method:"GET",
            url: `/notes/${id}`
        }).then(function (data) {

            if(data.note) {

                callNoteBox(data.note, id);

            } else {

                callBlankNoteBox(id);

            }

        })

    });

    async function callNoteBox(note, id) {

        const {value: formValues} = await swal({
            showCancelButton: true,
            title: 'Note',
            html:
            `<br />
            <div style="text-align:left">
                <h2>${note.title}</h2>
                <p>${note.body}</p>
            </div>
             <br />
            <input id="swal-input1" class="swal2-input">
            <textarea id="swal-input2" class="swal2-input"></textarea>`,
            focusConfirm: false,
            preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
                id
            ]
            }
        })
      
        if (formValues) {

            var newNote = {
                title: formValues[0],
                body: formValues[1]
            };

            $.ajax({
                method: "POST",
                url: "/articles/" + formValues[2],
                data: newNote
            })
            // With that done
            .then(function(data) {
                
                swal(
                    'Success',
                    `Note added!`,
                    'success'
                );

            });
        
        }

    }

    async function callBlankNoteBox(id) {

        const {value: formValues} = await swal({
            showCancelButton: true,
            title: 'Multiple inputs',
            html:
            `<input id="swal-input1" class="swal2-input">
            <textarea id="swal-input2" class="swal2-input" style="resize:none; overflow:auto;"></textarea>`,
            focusConfirm: false,
            preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
                id
            ]
            }
        })
      
        if (formValues) {

            var newNote = {
                title: formValues[0],
                body: formValues[1]
            };

            $.ajax({
                method: "POST",
                url: "/articles/" + formValues[2],
                data: newNote
            })
            // With that done
            .then(function(data) {
                
                swal(
                    'Success',
                    `Note added!`,
                    'success'
                );

            });

        }
    }
})