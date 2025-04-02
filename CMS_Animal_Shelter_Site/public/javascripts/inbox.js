async function fetchMessage(id) {
    try {
        const response = await fetch(`/messages/${id}`)
        const json = await response.json()

        document.getElementById("message_sender").textContent = json.sender
        document.getElementById("message_subject").textContent = json.subject
        document.getElementById("message_contents").textContent = json.contents

        const reply_button = document.getElementById("reply_button")
        reply_button.onclick = function() { window.location.href = `/messages/compose?recipient=${json.sender}`}
        reply_button.removeAttribute("disabled")
        
        document.getElementById("report_button").removeAttribute("disabled")

    } catch (error) {
        console.error(error.message)
    }
}