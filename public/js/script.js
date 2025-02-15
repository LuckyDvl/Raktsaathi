// public/js/script.js

// Helper function to build an address string from an address object.
// This will include only those parts that have been entered.
function formatAddress(addr) {
    if (!addr) return '';
    const parts = [];
    if (addr.street) parts.push(addr.street);
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.pinCode) parts.push(addr.pinCode);
    return parts.join(', ');
  }
  
  // Function to load and display donors with only the required details.
  function loadDonors() {
    fetch('/api/donors')
      .then(response => response.json())
      .then(donors => {
        console.log("Fetched Donors:", donors);
        let output = '<ul>';
        if (donors.length === 0) {
          output += '<li>No donors registered.</li>';
        } else {
          donors.forEach(donor => {
            // Build address string if available.
            const addressStr = donor.address ? formatAddress(donor.address) : '';
            
            output += `<li>
              <strong>Name:</strong> ${donor.name}<br>
              <strong>Age:</strong> ${donor.age}<br>
              <strong>Gender:</strong> ${donor.gender}<br>
              <strong>Mobile:</strong> ${donor.mobile}<br>
              <strong>Blood Group:</strong> ${donor.bloodGroup}<br>
              ${addressStr ? `<strong>Address:</strong> ${addressStr}<br>` : ''}
            </li>`;
          });
        }
        output += '</ul>';
        document.getElementById('donorList').innerHTML = output;
      })
      .catch(error => {
        console.error("Error fetching donors:", error);
        document.getElementById('donorList').innerText = "Error loading donors.";
      });
  }
  
  // Function to load and display blood requests (recipients) with the required details.
  function loadBloodRequests() {
    fetch('/api/requests')
      .then(response => response.json())
      .then(requests => {
        console.log("Fetched Requests:", requests);
        let output = '<ul>';
        if (requests.length === 0) {
          output += '<li>No blood requests available.</li>';
        } else {
          requests.forEach(request => {
            // Build address string if available.
            const addressStr = request.address ? formatAddress(request.address) : '';
            // Build a list of links for uploaded report images (if any).
            let photos = '';
            if (request.reportsImages && request.reportsImages.length > 0) {
              photos = request.reportsImages
                .map(img => `<a href="${img}" target="_blank">Photo</a>`)
                .join(', ');
            }
    
            output += `<li>
              <strong>Name:</strong> ${request.name}<br>
              <strong>Age:</strong> ${request.age}<br>
              <strong>Gender:</strong> ${request.gender}<br>
              <strong>Mobile:</strong> ${request.mobile}<br>
              <strong>Blood Group:</strong> ${request.bloodGroup}<br>
              ${addressStr ? `<strong>Address:</strong> ${addressStr}<br>` : ''}
              ${request.emergency ? `<strong>Emergency:</strong> ${request.emergency}<br>` : ''}
              ${photos ? `<strong>Photos:</strong> ${photos}` : ''}
            </li>`;
          });
        }
        output += '</ul>';
        document.getElementById('requestList').innerHTML = output;
      })
      .catch(error => {
        console.error("Error fetching blood requests:", error);
        document.getElementById('requestList').innerText = "Error loading blood requests.";
      });
  }
  
  // Automatically load both donors and blood requests when the home page loads.
  window.addEventListener("load", function() {
    loadDonors();
    loadBloodRequests();
  });
  