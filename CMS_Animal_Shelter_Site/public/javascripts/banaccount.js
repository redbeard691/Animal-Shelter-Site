async function banAccount(userID) {
    console.log("banAccount function called with:", userID); // Client-side log

    fetch('/admin/ban-user', { // Define a route on your server
        method: 'POST', // Or 'DELETE', depending on your API design
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userID }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert(`User "${userID}" has been banned.`);
          // Optionally, update the UI (e.g., disable the button)
        } else {
          alert(`Error banning user "${userID}": ${data.error || 'Unknown error'}`);
        }
      })
      .catch(error => {
        console.error('Error banning user:', error);
        alert('An unexpected error occurred while trying to ban the user.');
      });
}