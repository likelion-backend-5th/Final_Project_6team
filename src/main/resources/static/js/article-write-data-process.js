
    let index = {
        init: function () {
            $("#article-write").on("click", () => {
                this.save();
            });

        },

        save: function () {
            let data = {
                title: $("#title").val(),
                content: $("#content").val(),
                type: $("#type").val()
            }

            $.ajax({
                type: "POST",
                url: "/views/article",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
            }).done(function (res) {
                alert("글 작성이 완료되었습니다.");
                location.href = "/views/articlelist";
            }).fail(function (request,status,error) {
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            });

        },
    }

    index.init();