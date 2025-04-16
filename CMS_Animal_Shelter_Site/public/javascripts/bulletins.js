async function getResults() {
    // Fetch from server
    const url = "bulletins/search?"
    //console.log(url)
    const response = await fetch(url)
    const json = await response.json()

    // Add results to page
    const resultsDiv = document.getElementById("results-list")
    resultsDiv.innerHTML = ""
    for(var i = 0; i < json.length; i++){
        console.log(json[i])
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
    return `<div class="panel panel-default border">
                        <div class="panel-heading">
                            <h3>${json.title ? json.title : "Unknown"}</h3>
                        </div>
                        <div class="panel-body">
                            <p>${json.contents ? json.contents : "Unknown"}</p>
                        </div>
                    </div>`
}