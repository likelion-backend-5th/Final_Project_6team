document.addEventListener("DOMContentLoaded", function () {
    fetchArticleInfo();

    var submitButton = document.getElementById("article-update");
    submitButton.addEventListener("click", updateArticle);
});

function fetchArticleInfo() {
    var articleId = window.location.pathname.split('/').pop();
    fetch("/api/v1/articles/" + articleId)
        .then(response => response.json())
        .then(data => {
            document.getElementById("title").value = data.title;
            document.getElementById("content").value = data.content;
            document.getElementById("category").value = data.category;
            document.getElementById("type").value = data.type;
            document.getElementById("image-path").value = data.imagePath;

        })
        .catch(error => console.error("게시글 정보 가져오기 오류:", error));
}

function updateArticle() {
    var title = document.getElementById("title").value;
    var content = document.getElementById("content").value;
    var type = document.getElementById("type").value;
    var category = document.getElementById("category").value;
    var image = document.getElementById("image");


    if (image.files.length != 0) {
        const imageData = new FormData();
        imageData.append("file", image.files[0]);

        fetch("/s3/resource", {
            method: "POST",
            body: imageData
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message || "이미지 업로드 중 오류가 발생했습니다.");
                    });
                }
                return response.json();
            })
            .then(data => {
                var imagePath = data.path;
                var formData = new FormData();

                var jsonParams = {
                    title: title,
                    content: content,
                    category: category,
                    type: type,
                    imagePath: imagePath
                };

                formData.append("params", new Blob([JSON.stringify(jsonParams)], {type: "application/json"}));


                var articleId = window.location.pathname.split('/').pop();

                fetch("/api/v1/articles/" + articleId, {
                    method: "PUT",
                    body: formData
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(error => {
                                throw new Error(error.message || "게시글 수정 중 오류가 발생했습니다.");
                            });
                        }
                        if (response.status === 204 || response.status === 205) {
                            alert("게시글이 수정되었습니다.");
                            window.location.href = "/views/articles/" + articleId;
                            return;
                        }
                        return response.json();
                    })
                    .catch(error => {
                        console.error("게시글 수정 오류:", error);
                        alert(error.message);
                    })

            });
    }
    else {
        var imagePath = document.getElementById('image-path').value;
        var formData = new FormData();

        var jsonParams = {
            title: title,
            content: content,
            category: category,
            type: type,
            imagePath: imagePath
        };

        formData.append("params", new Blob([JSON.stringify(jsonParams)], {type: "application/json"}));


        var articleId = window.location.pathname.split('/').pop();

        fetch("/api/v1/articles/" + articleId, {
            method: "PUT",
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message || "게시글 수정 중 오류가 발생했습니다.");
                    });
                }
                if (response.status === 204 || response.status === 205) {
                    alert("게시글이 수정되었습니다.");
                    window.location.href = "/views/articles/" + articleId;
                    return;
                }
                return response.json();
            })
            .catch(error => {
                console.error("게시글 수정 오류:", error);
                alert(error.message);
            })
    }

}