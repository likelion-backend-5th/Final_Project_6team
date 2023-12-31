document.addEventListener('click', function (event) {
    if (event.target.classList.contains('fill-progress-title')) {
        const container = document.querySelector('.element-todo-body');
        container.innerHTML = '';
        getElementTodo(event);
    }

    if (event.target.classList.contains('create-todo-submit')) {
        var title = document.getElementById('todo-title').value;
        var content = document.getElementById('todo-content').value;
        var url = document.getElementById('todo-url').value;

        var jsonData = {
            title: title,
            content: content,
            url: url
        };
        createTodo(event.target.dataset.roadmapId, event.target.dataset.elementId, jsonData);
    }

    // updateTodo 관련 로직
    if (event.target.classList.contains('update-todo-button')) {
        var title = event.target.dataset.title;
        var content = event.target.dataset.content;
        var url = event.target.dataset.url;
        var todoId = parseInt(event.target.dataset.todoId);

        document.getElementById('update-todo-title').value = title;
        document.getElementById('update-todo-content').value = content;
        document.getElementById('update-todo-url').value = url;

        // update-submit data-todoId 추가
        document.getElementById('update-todo-submit').dataset.todoId = todoId;
    }

    if (event.target.classList.contains('update-todo-submit')) {
        var title = document.getElementById('update-todo-title').value;
        var content = document.getElementById('update-todo-content').value;
        var url = document.getElementById('update-todo-url').value;
        var todoId = parseInt(event.target.dataset.todoId);

        var jsonData = {
            title: title,
            content: content,
            url: url
        };
        updateTodo(event.target.dataset.roadmapId, event.target.dataset.elementId, todoId, jsonData);
    }

    // deleteTodo 관련 로직
    if (event.target.classList.contains('delete-todo-button')) {
        var roadmapId = event.target.dataset.roadmapId;
        var elementId = event.target.dataset.elementId;
        var todoId = parseInt(event.target.dataset.todoId);

        deleteTodo(roadmapId, elementId, todoId);
    }

    // updateDone 관련 로직
    if (event.target.classList.contains('form-check-input')) {
        var roadmapId = event.target.dataset.roadmapId;
        var elementId = event.target.dataset.elementId;
        var todoId = event.target.dataset.todoId;

        updateDone(roadmapId, elementId, todoId);
        document.getElementById('donePercent').textContent = doneProgress() + '%';
    }

    // update element 관련 로직
    if (event.target.classList.contains('update-element-button')) {
        var roadmapId = event.target.dataset.roadmapid;
        var elementId = event.target.dataset.elementid;
        var elementTitle = event.target.dataset.elementTitle;
        var elementStart = event.target.dataset.elementStart;
        var elementEnd = event.target.dataset.elementEnd;

        document.getElementById('update-element-submit').dataset.roadmapId = roadmapId;
        document.getElementById('update-element-submit').dataset.elementId = elementId;
        document.getElementById('update-element-title').value = elementTitle;
        document.getElementById('update-element-start').value = elementStart;
        document.getElementById('update-element-end').value = elementEnd;
    }
    if (event.target.classList.contains('update-element-submit')) {
        var roadmapId = event.target.dataset.roadmapId;
        var elementId = event.target.dataset.elementId;
        console.log(event.target.dataset)

        var title = document.getElementById('update-element-title').value;
        var content = document.getElementById('update-element-content').value;
        var start = document.getElementById('update-element-start').value;
        var end = document.getElementById('update-element-end').value;

        var jsonData = {
            title: title,
            content: content,
            startDate: start,
            endDate: end
        }

        updateElement(roadmapId, elementId, jsonData);
    }

    // delete element 관련 로직
    if (event.target.classList.contains('delete-element-button')) {
        var roadmapId = event.target.dataset.roadmapid;
        var elementId = event.target.dataset.elementid;

        deleteElement(roadmapId, elementId);
    }
})

$('#createTodoModal').on('hidden.bs.modal', function () {
    location.reload();
})

async function getElementTodo(event) {
    var roadmapId = event.target.dataset.roadmapId;
    var elementId = event.target.dataset.elementId;
    var elementTitle = event.target.dataset.elementTitle;
    var elementStart = event.target.dataset.start;
    var elementEnd = event.target.dataset.end;

    await fetch(`/api/v1/roadmaps/${roadmapId}/elements/${elementId}/todo`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(elementTodoList => {
            console.log(elementTodoList);
            displayTodo(roadmapId, elementId, elementTodoList, elementTitle, elementStart, elementEnd);
        })
        .catch(error => {
            console.log(error.message);
            alert('Todo 목록을 가져오는 도중 에러가 발생하였습니다.')
        })
}

// elementTodo 모달창 내용 생성
function displayTodo(roadmapId, elementId, todoDataList, elementTitle, elementStart, elementEnd) {
    // createTodoSubmit
    document.getElementById('create-todo-submit').dataset.roadmapId = roadmapId;
    document.getElementById('create-todo-submit').dataset.elementId = elementId;

    // updateTodoSubmit
    document.getElementById('update-todo-submit').dataset.roadmapId = roadmapId;
    document.getElementById('update-todo-submit').dataset.elementId = elementId;

    var modal = document.getElementById('roadmapElementTodoModalLabel');
    modal.textContent = '일정: ' + elementTitle;

    var container = document.querySelector('.element-todo-body');
    todoDataList.forEach(data => {
        var todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-item', 'row');

        var todoDone = document.createElement('div');
        todoDone.classList.add('todo-done');
        todoDone.style.textAlign = 'left';
        todoDone.innerHTML =
            `
            <div class="form-check" style="text-align: left">
              <input class="form-check-input" type="checkbox" value="" id="todo-done-check" ${data.done ? 'checked' : ''}
              data-roadmap-id="${roadmapId}" data-element-id="${elementId}" data-todo-id="${data.id}">
              <a class="form-check-label" for="todo-done-check" href="#" >
                ${data.title}
              </a>
              <span class="delete-todo-button" id="delete-todo" style="float: right;"
              data-roadmap-id="${roadmapId}" data-element-id="${elementId}" data-todo-id="${data.id}"
              >삭제</span>
              <span style="float: right;">&nbsp|&nbsp</span>
              <span class="update-todo-button" id="update-todo-button" data-bs-toggle="modal" 
              data-bs-target="#updateTodo" style="float: right;"
              data-title='${data.title}' data-content='${data.content}' 
              data-url='${data.url}' data-todo-id="${data.id}"
                >수정</span>
            </div>
            `
        todoDiv.appendChild(todoDone);
        container.appendChild(todoDiv);
    })

    var donePercent = document.createElement('span');
    donePercent.classList.add('col', 'align-self-end')
    donePercent.id = 'donePercent';
    donePercent.style.float = 'right';
    donePercent.textContent = doneProgress() + '%';

    modal.append(donePercent);

    // createTodo
    var createTodoButton = document.createElement('span');
    createTodoButton.innerHTML =
        `
        <button type="button" class="btn btn-sm create-todo-button"  data-bs-toggle="modal" data-bs-target="#createTodoModal"">Todo 추가하기</button>
        `

    var updateElementButton = document.createElement('span');
    updateElementButton.innerHTML =
        `
        <button type="button" class="btn btn-sm update-element-button"  data-bs-toggle="modal" data-bs-target="#updateElementModal"
        data-roadmapId="${roadmapId}" data-elementId="${elementId}" data-element-title="${elementTitle}" 
        data-element-start="${elementStart}" data-element-end="${elementEnd}"
        >일정수정</button>
        `

    var deleteElementButton = document.createElement('span');
    deleteElementButton.innerHTML =
        `
        <button type="button" class="btn btn-sm delete-element-button" id="delete-element"
        data-roadmapId="${roadmapId}" data-elementId="${elementId}"
        >일정삭제</button>
        `
    container.append(createTodoButton);
    container.append(updateElementButton);
    container.append(deleteElementButton);
}

// done-progress data-end 변경 기능
function doneProgress() {
    var elements = document.querySelectorAll('.form-check');
    var todoCount = elements.length;
    var trueCount = 0;

    // 원래 값이 없다면 0%
    if (todoCount === 0) {
        return 0;
    } else {
        elements.forEach(element => {
            var checkbox = element.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                trueCount = trueCount + 1;
            }
        });
        return Math.round(trueCount / todoCount * 100);
    }
}

// createTodo
function createTodo(roadmapId, elementId, jsonData) {
    fetch(`/api/v1/roadmaps/${roadmapId}/elements/${elementId}/todo`, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(jsonData)
    })
        .then(data => {
            alert("todo가 생성되었습니다");
            location.reload();
        })
        .catch(error => {
            console.error("todo 생성 오류:", error);
            alert(error.message);
        });
}

// updateTodo
function updateTodo(roadmapId, elementId, todoId, jsonData) {
    fetch(`/api/v1/roadmaps/${roadmapId}/elements/${elementId}/todo/${todoId}`, {
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(jsonData)
    })
        .then(data => {
            alert("todo가 수정되었습니다");
            location.reload();
        })
        .catch(error => {
            console.error("todo 수정 오류:", error);
            alert(error.message);
        });
}

// deleteTodo
function deleteTodo(roadmapId, elementId, todoId) {
    var answer = confirm("정말로 삭제 하시겠습니까?")
    if (answer) {
        fetch(`/api/v1/roadmaps/${roadmapId}/elements/${elementId}/todo/${todoId}`, {
            method: 'DELETE'
        })
            .then(data => {
                alert("todo가 삭제 되었습니다");
            })
            .catch(error => {
                console.error("todo 삭제 오류:", error);
                alert(error.message);
            });
    }
}

// todoUpdateDone
function updateDone(roadmapId, elementId, todoId) {
    fetch(`/api/v1/roadmaps/${roadmapId}/elements/${elementId}/todo/${todoId}/done`, {
        method: 'PUT'
    })
        .then(response => {
            console.log("todo 완료!");
        })
        .catch(error => {
            console.log(error.message);
        })
}

// element update
function updateElement(roadmapId, elementId, jsonData) {
    fetch(`/api/v1/roadmaps/${roadmapId}/elements/${elementId}`, {
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(jsonData)
    })
        .then(response => {
            alert('일정이 수정되었습니다.')
            location.reload();
        })
        .catch(error => {
            console.log(error.message);
        })
}

// element delete
function deleteElement(roadmapId, elementId) {
    var answer = confirm('정말로 해당 일정을 삭제하시겠습니까?');

    if (answer)
        fetch(`/api/v1/roadmaps/${roadmapId}/elements/${elementId}`, {
            method: 'DELETE'
        })
            .then(response => {
                alert('일정이 삭제되었습니다.');
                location.reload();
            })
            .catch(error => {
                console.log(error.message);
            })
}