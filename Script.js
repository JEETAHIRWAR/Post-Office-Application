// Wait for the DOM content to be fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Get references to various HTML elements by their IDs
    const ipAddressElement = document.getElementById('ipAddress');
    const IpAddressElement = document.getElementById('IpAddress');
    const latitudeElement = document.getElementById('latitude');
    const longitudeElement = document.getElementById('longitude');
    const cityElement = document.getElementById('city');
    const regionElement = document.getElementById('region');
    const organisationElement = document.getElementById('organisation');
    const hostElement = document.getElementById('host');
    const timezoneElement = document.getElementById('timezone');
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    const pincodeElement = document.getElementById('pincode');
    const messageElement = document.getElementById('message');
    const searchInput = document.querySelector('.sInput input');
    const cardsContainer = document.querySelector('.cardsContainer');
    const getLocationButton = document.getElementById("getLocation");
    const backButton = document.getElementById("backButton");
    const mainContainer = document.querySelector(".mainContainer");
    const secondContainer = document.querySelector(".SecondContainer");

    // Initially hide the SecondContainer
    secondContainer.style.display = "none";

    // Set hostElement to the platform obtained from navigator.platform
    const platform = navigator.platform;
    hostElement.textContent = platform;

    // Alternatively, if you want to set hostElement to the hostname of the current URL
    // const hostname = window.location.hostname;
    // hostElement.textContent = hostname;

    // Fetch the user's IP address from jsonip.com
    fetch('https://jsonip.com')
        .then(response => response.json())
        .then(data => {
            // Extract IP address from the response
            const ipAddress = data.ip;
            const IpAddress = data.ip;
            // Set IP address elements in the HTML
            ipAddressElement.textContent = ipAddress;
            IpAddressElement.textContent = IpAddress;
        })
        .catch(error => console.error('Error fetching IP Address:', error));

    // Add click event listener to getLocationButton
    getLocationButton.addEventListener("click", () => {
        // Hide the main container and display the second container
        mainContainer.style.display = "none";
        secondContainer.style.display = "block";

        // Fetch User's IP Address and Location Details
        fetch('https://jsonip.com')
            .then(response => response.json())
            .then(data => {
                // Extract IP address from the response
                const ipAddress = data.ip;
                // Set IP address element in the HTML
                ipAddressElement.textContent = ipAddress;
                // Fetch more location details using IP address from ipapi.co
                fetch(`https://ipapi.co/${ipAddress}/json/`)
                    .then(response => response.json())
                    .then(locationData => {
                        // Display location details on the webpage
                        displayLocationDetails(locationData);
                        // Fetch and display post offices based on user's location
                        fetchPostOffices(locationData.postal);
                        // Show user's location on the map
                        showUserLocationOnMap(locationData.latitude, locationData.longitude);
                    })
                    .catch(error => console.error('Error fetching location details:', error));
            })
            .catch(error => console.error('Error fetching IP Address:', error));
    });

    // Function to display location details on the webpage
    const displayLocationDetails = (locationData) => {
        // Update HTML elements with location details
        latitudeElement.textContent = locationData.latitude;
        longitudeElement.textContent = locationData.longitude;
        cityElement.textContent = locationData.city;
        regionElement.textContent = locationData.region;
        organisationElement.textContent = locationData.org;
        timezoneElement.textContent = locationData.timezone;
        // Get current date and time for user's timezone
        const currentDate = new Date().toLocaleDateString('en-US', { timeZone: locationData.timezone });
        const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: locationData.timezone });
        dateElement.textContent = currentDate;
        timeElement.textContent = currentTime;
        pincodeElement.textContent = locationData.postal;
        messageElement.textContent = 'Loading post offices...';
    };

    // Function to fetch and display post offices based on pincode
    const fetchPostOffices = (pincode) => {
        fetch(`https://api.postalpincode.in/pincode/${pincode}`)
            .then(response => response.json())
            .then(data => {
                const postOffices = data[0].PostOffice;
                // Display post office details on the webpage
                displayPostOffices(postOffices);
                // Show the number of post offices found
                messageElement.textContent = `${postOffices.length}`;
                // Show post offices on map (not implemented in this code snippet)
            })
            .catch(error => console.error('Error fetching post offices:', error));
    };

    // Function to display post office details on the webpage
    const displayPostOffices = (postOffices) => {
        cardsContainer.innerHTML = '';
        postOffices.forEach(postOffice => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <p>Name: <span>${postOffice.Name}</span></p>
                <p>Branch Type: <span>${postOffice.BranchType}</span></p>
                <p>Delivery Status: <span>${postOffice.DeliveryStatus}</span></p>
                <p>District: <span>${postOffice.District}</span></p>
                <p>Division: <span>${postOffice.Division}</span></p>
            `;
            cardsContainer.appendChild(card);
        });
    };

    // Function to update the iframe source with user's latitude and longitude
    const showUserLocationOnMap = (latitude, longitude) => {
        const mapFrame = document.getElementById('map');
        mapFrame.innerHTML = `
            <iframe src="https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed" 
                width="100%" height="100%" frameborder="0" style="border:0"></iframe>
        `;
    };

    // Add input event listener to searchInput for filtering post offices
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const name = card.querySelector('p:first-child span').textContent.toLowerCase();
            if (name.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Add click event listener to backButton for reloading the page
    backButton.addEventListener("click", () => {
        window.location.reload();
    });
});
