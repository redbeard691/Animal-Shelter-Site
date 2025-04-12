let currentMessageId = null; // Variable to store the ID of the currently viewed message

async function fetchMessage(id) {
    try {

        currentMessageId = id;
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

async function reportCurrentMessage() {
    if (!currentMessageId) {
        alert('No message selected to report.');
        return;
    }

    const reportReason = prompt('Please enter the reason for reporting this message:');
    if (reportReason) {
        fetch('/messages/report-message-admin', { // New server-side route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messageId: currentMessageId,
                reason: reportReason
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Message reported to admin successfully.');
                // Optionally, disable the report button after reporting
                const reportButton = document.getElementById('report_button');
                if (reportButton) {
                    reportButton.disabled = true;
                    reportButton.onclick = null; // Remove the onclick handler
                }
            } else {
                alert(`Error reporting message: ${data.error || 'Unknown error'}`);
            }
        })
        .catch(error => {
            console.error('Error reporting message:', error);
            alert('An unexpected error occurred while reporting the message.');
        });
    }
}
