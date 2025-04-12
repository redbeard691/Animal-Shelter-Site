 async function reportAccount(contentID, report, description) {

            fetch('/messages/report-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reportType: report, // 'post' or 'user' (as passed to the function)
                    contentId: contentID, // The ID or username of what's being reported
                    reason: description // The reason entered by the user
                }),
            })

            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert(`Report about "${contentID}" has been sent`);
              } else {
                alert(`Error reporting content "${contentID}": ${data.error || 'Unknown error'}`);
              }
            })
            .catch(error => {
              console.error('Error reporting user:', error);
              alert('An unexpected error occurred while trying to send report.');
            });

        }