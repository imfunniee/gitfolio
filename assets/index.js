function readJsonFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function onFilterChange(type){
	let projects = document.getElementById(type === 'repos' ? 'projects' : 'forks');
	let filter = document.getElementById(type + "_filter")
	projects.innerHTML = '';
	readJsonFile("./" + type + ".json", function(text){
		let data = JSON.parse(text);
		let result = [];
		
		if(filter.value === 'date')
			result = data.sort(GetSortOrder('created_at', -1))
		if(filter.value === 'name')
			result = data.sort(GetSortOrder('name', 1))
		if(filter.value === 'stared')
			result = data.sort(GetSortOrder('stargazers_count', -1))
		if(filter.value === 'forked')
			result = data.sort(GetSortOrder('forks_count', -1))
		
		if(result.length){
			for(var i = 0;i < result.length;i++){
                    document.getElementById(type === 'repos' ? 'projects' : 'forks').innerHTML += `
                    <a href="${result[i].html_url}" target="_blank">
                    <section>
                        <div class="section_title">${result[i].name}</div>
                        <div class="about_section">
						<span style="display:${result[i].description == undefined ? 'none' : 'block'};">${result[i].description}</span>
                        </div>
                        <div class="bottom_section">
                            <span style="display:${result[i].language == null ? 'none' : 'inline-block'};"><i class="fas fa-code"></i>&nbsp; ${result[i].language}</span>
                            <span><i class="fas fa-star"></i>&nbsp; ${result[i].stargazers_count}</span>
                            <span><i class="fas fa-code-branch"></i>&nbsp; ${result[i].forks_count}</span>
                        </div>
                    </section>
                    </a>`;        
			}
		}
	});
}

function GetSortOrder(prop, order) {  
    return function(a, b) {  
        if (a[prop] > b[prop]) {  
            return 1 * order;  
        } else if (a[prop] < b[prop]) {  
            return -1 * order;  
        }  
        return 0;  
    }  
} 