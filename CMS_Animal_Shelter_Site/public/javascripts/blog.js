async function fetchBlogs() {
    try {
        const response = await fetch('/pages/info/blog/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blogs = await response.json();
        populateTable(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        // Optionally display an error message to the user
    }
}

function populateTable(blogs) {
    const tableBody = document.getElementById('blog-table-body');
    tableBody.innerHTML = ''; // Clear any existing content

    blogs.forEach(blog => {
        const row = tableBody.insertRow();
        const titleCell = row.insertCell();
        const authorCell = row.insertCell();
        const createdAtCell = row.insertCell();

        // Make the title a clickable link using the blog's slug
        const titleLink = document.createElement('a');
        titleLink.href = `/pages/info/viewblog/${blog.slug}`;
        titleLink.textContent = blog.title;
        titleCell.appendChild(titleLink);

        authorCell.textContent = blog.author;
        createdAtCell.textContent = new Date(blog.createdAt).toLocaleDateString();
        // Add more cells for other blog properties if needed
    });
}

window.onload = fetchBlogs;