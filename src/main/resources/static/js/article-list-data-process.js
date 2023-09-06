
// 게시판 카테고리 버튼
document.addEventListener("DOMContentLoaded", function() {
    var frontEndBtn = document.getElementById("category-front-end");
    frontEndBtn.addEventListener("click", function() {
        fetchArticles(savedPage, 'FRONTEND')
        document.querySelector('#category-title').textContent = 'FRONT-END 게시판';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var backEndBtn = document.getElementById("category-back-end");
    backEndBtn.addEventListener("click", function() {
        fetchArticles(savedPage, 'BACKEND')
        document.querySelector('#category-title').textContent = 'BACK-END 게시판';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var mobileBtn = document.getElementById("category-mobile");
    mobileBtn.addEventListener("click", function() {
        fetchArticles(savedPage, 'MOBILE')
        document.querySelector('#category-title').textContent = 'MOBILE 게시판';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var gmaeBtn = document.getElementById("category-game");
    gmaeBtn.addEventListener("click", function() {
        fetchArticles(savedPage, 'GAME')
        document.querySelector('#category-title').textContent = 'GAME 게시판';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var devOpsBtn = document.getElementById("category-devops");
    devOpsBtn.addEventListener("click", function() {
        fetchArticles(savedPage, 'DEVOPS')
        document.querySelector('#category-title').textContent = 'DEVOPS 게시판';
    });
});

// createdAt 출력 형식
function formatCreatedAt(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


// articles 표시
function displayArticles(articles) {
    const articleList = document.getElementById('article-list');
    articleList.innerHTML = ''; // 이전 데이터 초기화

    articles.forEach(function (article) {
        var row = document.createElement('tr');
        var titleElement = document.createElement('td');
        var usernameElement = document.createElement('td');
        var typeElement = document.createElement('td');
        var createdAtElement = document.createElement('td');
        var viewCountElement = document.createElement('td')

        var titleLink = document.createElement('a');
        titleLink.href = article.id;
        titleLink.textContent = article.title;
        titleElement.appendChild(titleLink);

        // type 값 한글로 바꾸기
        const typeMappings = {
            "NOTI": '공지',
            "QUESTION": '질문',
            "STUDY": '스터디',
            "TIP": '지식',
            "CHAT": '잡담'
        };

        let typeText = typeMappings[article.type] || '';
        typeElement.textContent = typeText;

        usernameElement.textContent = article.username;
        createdAtElement.textContent = formatCreatedAt(article.createdAt);
        viewCountElement.textContent = article.viewCount;

        row.appendChild(typeElement);
        row.appendChild(titleElement);
        row.appendChild(usernameElement);
        row.appendChild(createdAtElement);
        row.appendChild(viewCountElement);

        articleList.appendChild(row);

    });
}

// 페이지 번호 표시
function displayPageNumbers() {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    for (let i = 0; i < totalPages; i++) {
        const pageNumberButton = document.createElement('button');
        pageNumberButton.textContent = i + 1;
        pageNumberButton.classList.add('btn');
        pageNumberButton.classList.add('custom-button');

        if (i === currentPage) {
            pageNumberButton.classList.add('active');
        }

        pageNumberButton.addEventListener('click', () => {
            fetchArticles(i);
        });

        paginationContainer.appendChild(pageNumberButton);
    }
}


let currentPage = 0;
let totalPages = 0;

function fetchArticles(page, category) {
    fetch(`/api/v1/articles?page=${page}&category=${category}`)
        .then(response => response.json())
        .then(result => {
            totalPages = result.totalPages;
            currentPage = result.number;
            displayArticles(result.content);
            displayPageNumbers();

            localStorage.setItem('currentPage', currentPage);
        })
        .catch(error => console.error('Error:', error));
}

// window.localStorage.clear();
const savedPage = localStorage.getItem('currentPage');
if (savedPage !== null) {
    fetchArticles(savedPage, 'GAME');
} else {
    fetchArticles(0, 'GAME');
}
