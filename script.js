// Generate a unique ID for the user’s device
function getDeviceID() {
    let deviceID = localStorage.getItem("deviceID");
    if (!deviceID) {
        deviceID = "device-" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("deviceID", deviceID);
    }
    return deviceID;
}

// Function to save the record
function saveRecord(record) {
    fetch("https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_URL/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record)
    })
    .then(() => alert("Data submitted successfully!"))
    .catch(error => console.error("Error:", error));
}

// Attach event listener to submission
document.addEventListener("DOMContentLoaded", function() {
    const table = document.getElementById("species-records");

    table.addEventListener("click", function(event) {
        if (event.target.classList.contains("submit-btn")) {
            const row = event.target.parentElement.parentElement;
            const username = row.cells[0].querySelector("input").value || null; // If blank, use device ID
            const deviceID = getDeviceID(); // Generate or retrieve stored device ID
            const image = row.cells[1].querySelector("input[type=file]").files[0]?.name || "No image";
            const species = row.cells[2].querySelector("input").value;
            const date = row.cells[3].querySelector("input").value;
            const place = row.cells[4].querySelector("input").value;

            // If username is blank, fall back to device ID
            const identifier = username || deviceID;

            const record = { identifier, image, species, date, place };
            saveRecord(record);
        }
    });
});

// Function to get the current date
function getDate(button) {
    button.previousElementSibling.value = new Date().toISOString().split("T")[0];
}

// Function to get the device location
function getLocation(button) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            button.previousElementSibling.value = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to use the camera for image capture
function openCamera(button) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.capture = "environment";
    fileInput.onchange = function() {
        button.previousElementSibling.files = fileInput.files;
    };
    fileInput.click();
}
