function getFormData(form) {
    const formData = new FormData(form)
    const dataObj = {}
    formData.forEach((value, key) => dataObj[key] = value)
    return dataObj
}

async function loginUser(data) {
    try {
        const response = await sendDataToServer(data);

        if (response.ok) {
            window.location.href = "/views/main"
        } else {
            const errorRes = await response.json()
            alert(errorRes.message || "에러")
        }
    } catch (error) {
        console.error("로그인 에러", error)
    }
}
// 서버 통신
async function sendDataToServer(data) {
    return await fetch("/api/v1/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
}

function handleLogin(event) {
    event.preventDefault()

    const formData = getFormData(event.target)

    loginUser(formData).then(() => {
        window.history.pushState({}, null, '/views/main')
    }).catch(error => {
        console.error("로그인 에러", error)
    })
}