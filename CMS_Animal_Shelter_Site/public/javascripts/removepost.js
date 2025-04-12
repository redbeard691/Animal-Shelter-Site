async function removePost(postID) {
    console.log("Deleting Post ID:", postID); // Updated log

    fetch('/admin/delete-post', { // Or '/posts/delete'
        method: 'POST', // Or 'DELETE'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: postID }), // Send postId
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Post "${postID}" has been removed.`);
            window.location.href = '/posts'; // Redirect on the client-side
            
        } else {
            alert(`Error removing post "${postID}": ${data.error || 'Unknown error'}`);
        }
    })
    .catch(error => {
        console.error('Error deleting post:', error); // Updated log message
        alert('An unexpected error occurred while trying to delete the post.');
    });
}