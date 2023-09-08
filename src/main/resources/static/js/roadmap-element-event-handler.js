// 이벤트 리스너 연결
window.addEventListener('DOMContentLoaded', attachRoadmapElementEventListeners);

// 로드맵 요소 이벤트 리스너 연결
function attachRoadmapElementEventListeners() {
    const modalForm = document.getElementById('addRoadmapElement');

    // 폼 제출 이벤트에 대한 핸들러 연결
    modalForm.addEventListener("submit", function(event) {
        handleCreateRoadmapElement(event);
    });
}

// 로드맵 요소 생성 처리
function handleCreateRoadmapElement(event) {
    event.preventDefault()

    const formData = getFormData(event.target)
    // 현재 페이지의 roadmapId 추출
    const roadmapId = getRoadmapIdFromUrl();

    createRoadmapElement(formData, roadmapId).then(() => {
        window.history.pushState({}, null, `/views/roadmaps/${roadmapId}/elements`)
    }).catch(error => {
        console.error("로드맵 엘리멘트 생성 에러", error)
    })
}