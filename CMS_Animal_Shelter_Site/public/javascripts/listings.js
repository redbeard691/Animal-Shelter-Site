async function getResults() {
    // Read filter user inputs, ignoring empty values
    const form = document.getElementById("filters")
    const filterData = new FormData(form)
    const filters = removeBlankAttributes(Object.fromEntries(filterData))
    //console.log(filters)

    // Fetch from server
    const url = "/posts/search?" + new URLSearchParams(filters)
    //console.log(url)
    const response = await fetch(url)
    const json = await response.json()

    console.log(json)

    // Add results to page
    const resultsDiv = document.getElementById("results-list")
    resultsDiv.innerHTML = ""
    for(var i = 0; i < json.length; i++){
        resultsDiv.innerHTML += resultJsonToHtml(json[i])
    }
}

function removeBlankAttributes(obj) {
    const result = {};
    for (const key in obj) {
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
            result[key] = obj[key];
        }
    }
    return result;
}

// TODO: Handle user-uploaded post & profile images. Might require additional fetches?
function resultJsonToHtml(json) {
    return `<a class="row border-bottom p-2 m-1 text-decoration-none text-body" href="/posts/view/${json.id}">
                <div class="col-auto">
                    <img src="/images/${json.picture}" height="100px" alt="">
                </div>
                <div class="col-auto">
                    <table class="table table-borderless table-sm me-5">
                        <tr>
                            <th>Name:</th>
                            <td>${json.name ? json.name : "Unknown"}</td>
                        </tr>
                        <tr>
                            <th>Type:</th>
                            <td>${json.type}</td>
                        </tr>
                        <tr>
                            <th>Location:</th>
                            <td>${json.city}, ${json.state}</td>
                        </tr>
                    </table>
                </div>
                <div class="col p-0"></div>
                <div class="col-auto row">
                    <div class="col align-content-center">
                        <img src="/images/${json.User.profilePic}" class="img-thumbnail rounded-circle" alt="" height="75px" width="75px">
                    </div>
                    <div class="col align-content-center">
                        <h6>Posted by</h6>
                        <p class="m-0">${json.author}</p>
                    </div>
                </div>
            </a>`
}