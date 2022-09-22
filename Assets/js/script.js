let container = $(".container");
let dayContainer = $("#currentDay");

// The start and end of day params set in 24 hour time
let dayStartHour = 9;
let dayEndHour = 17;

// Cache for storing any data we mess with
let dataCache = [];

// Loads our data from localstorage and checks if it is empty
function loadData() {
    let data = JSON.parse(localStorage.getItem("calendarInfo"));
    console.log(data);

    if (data === null) {
        return;
    }

    dataCache = data;
}

// Saves our data to localstorage
function saveData() {
    localStorage.setItem("calendarInfo", JSON.stringify(dataCache));
}

// Saves all objects inside the calendar container
function saveListItem(event) {
    console.log(event);
    let button = $(event.target);
    let buttonChildren = button.siblings();
    let timeElement = $(buttonChildren[0]);
    let descElement = $(buttonChildren[1]);

    let timeAt = timeElement.attr("data-timestamp");
    let description = descElement.val();
    if (description === "") {
        console.log("canceld save")
        return;
    }

    console.log("saved")

    let listObject = {
        time: timeAt,
        description: description
    }
    console.log(listObject);

    dataCache.push(listObject);

    saveData();
}

// This creates a valid list object for the calendar container
function loadListItem(time, description) {
    let momentObject = moment(String(time), "H");

    let contChildren = container.children().children('div');
    contChildren.each(function(){
        if (this.textContent === momentObject.format("hA")) {
            let siblings = $(this).siblings();
            console.log(siblings[0]);
            $(siblings[0]).val(description);
        }
    })

}

// Renders all data inside dataCache
function renderData() {
    dataCache.sort(function(a, b) {
        return a.time-b.time;
    })

    console.log(dataCache);

    dataCache.forEach(element => {
        loadListItem(element.time, element.description);
    })
};

// This preloads the calendar objects we defined in 'dayStartHour' and 'dayEndHour'
function createCalendarObjects() {
    let startTime = dayStartHour;

    while (startTime <= dayEndHour) {
        let time = moment(String(startTime), "H");
        let row = $("<div>").addClass("row");

        let hourObject = $("<div>").addClass("hour pad");
        hourObject.attr("data-timestamp", startTime);
        hourObject.text(time.format("hA"));

        let descObject = $("<input>").addClass("description pad");
        if (time.format("hA")== moment().format("hA")) {
            descObject.addClass("present");
        } else if (time > moment()) {
            descObject.addClass("future");
        } else {
            descObject.addClass("past");
        }

        let buttonObject = $("<button>").addClass("saveBtn");
        buttonObject.text("💾");

        row.append(hourObject);
        row.append(descObject);
        row.append(buttonObject);

        container.append(row);

        startTime++;
    }
}

dayContainer.text(moment().format("dddd, MMMM Do"));

createCalendarObjects();
loadData();
renderData();
container.on("click", ".saveBtn", saveListItem);