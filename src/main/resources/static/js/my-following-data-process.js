document.addEventListener('DOMContentLoaded', () => {
    // 초기 페이지 번호 설정
    let currentPage = 1;
    const itemsPerPage = 4; // 한 페이지에 보여줄 유저 수

    // 페이지 로드시 초기 데이터 표시
    fetchUserData();

    // 서버에서 유저 데이터를 가져와서 표시하는 함수
    function fetchUserData() {
        const userId = localStorage.getItem('userId');

        fetch(`/api/v1/users/${userId}/following-list?num=${currentPage - 1}&limit=${itemsPerPage}`)
            .then((response) => response.json())
            .then((data) => {
                const userList = document.getElementById('userList');
                userList.innerHTML = '';

                if (data.content) {
                    // 데이터를 테이블에 표시합니다.
                    data.content.forEach((user) => {
                        const userItem = document.createElement('div');
                        const createdAtString = getRelativeTime(user.createdAt);
                        userItem.innerHTML = `
                        <div class="card" style="margin-bottom: 20px">
                            <div class="card-body">
                                <h6><span class="badge rounded-pill id-icon">아이디</span>${user.username}</h6>
                                <p><span class="badge rounded-pill status-icon">상태</span>${createdAtString}</p>
                                <div class="btn-style">
                                    <button onclick="viewProfile('${user.username}')" class="btn btn-primary profile-btn">프로필 보기</button>
                                    <button onclick="clickBtn('${user.toUserId}')" class="btn btn-primary follow-btn">언팔로우</button>
                                </div>
                            </div>
                        </div>
                    `;
                        userList.appendChild(userItem);
                    });

                    // 페이지네이션 업데이트
                    const totalPages = Math.ceil(data.content.length / itemsPerPage);
                    updatePagination(totalPages);
                } else {
                    userList.innerHTML = `<h3>팔로우한 유저가 없습니다.</h3>`;
                }
            })
            .catch((error) => {
                console.error('데이터를 가져오는 중 오류 발생:', error);
            });
    }

    // 페이지네이션을 업데이트하는 함수
    function updatePagination(totalPages) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        // 이전 페이지 버튼 추가
        const prevButton = createPaginationButton('이전', currentPage > 1 ? currentPage - 1 : 1);
        pagination.appendChild(prevButton);

        // 페이지 번호 버튼 추가
        for (let page = 1; page <= totalPages; page++) {
            const pageButton = createPaginationButton(page, page);
            pagination.appendChild(pageButton);
        }

        // 다음 페이지 버튼 추가
        const nextButton = createPaginationButton('다음', currentPage < totalPages ? currentPage + 1 : totalPages);
        pagination.appendChild(nextButton);
    }

    // 페이지네이션 버튼을 생성하는 함수
    function createPaginationButton(label, page) {
        const button = document.createElement('li');
        button.className = 'page-item';
        button.innerHTML = `<a class="page-link" href="#">${label}</a>`;
        button.addEventListener('click', () => {
            currentPage = page;
            fetchUserData();
        });
        return button;
    }
});

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date() - (9 * 60 * 60 * 1000);

    const timeDiff = now - date;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    if (timeDiff < minute) {
        return '방금';
    } else if (timeDiff < hour) {
        const minutesAgo = Math.floor(timeDiff / minute);
        return `${minutesAgo}분 전`;
    } else if (timeDiff < day) {
        const hoursAgo = Math.floor(timeDiff / hour);
        return `${hoursAgo}시간 전`;
    } else if (timeDiff < month) {
        const daysAgo = Math.floor(timeDiff / day);
        return `${daysAgo}일 전`;
    } else if (timeDiff < year) {
        const monthsAgo = Math.floor(timeDiff / month);
        return `${monthsAgo}달 전`;
    } else {
        const yearsAgo = Math.floor(timeDiff / year);
        return `${yearsAgo}년 전`;
    }
}

function clickBtn(userId) {
    const confirmed = confirm('언팔로우 하시겠습니까?')
    if (confirmed) {
        handleUnfollow(userId)
    }
}

function viewProfile(username) {
    localStorage.setItem('currentWriter', username);
    window.location.href = "/views/user-profile";
}

async function handleUnfollow(userId) {
    // TODO api 교체후 수정하기
    fetch(`/api/v1/users/${userId}/follow`, {
        method: 'DELETE'
    }).then(() => {
        window.location.reload()
    }).catch((error) => {
        alert(error.message)
        console.error(error.message)
    })
}