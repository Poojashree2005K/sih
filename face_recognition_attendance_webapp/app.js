async function fetchData() {
    try {
        const response = await fetch('http://127.0.0.1:5000/get-attendance-data'); // Your Flask API URL
        const data = await response.json();
        console.log('Fetched Data:', data); // Log the fetched data
        updateChart(data); // Function to update the chart with the fetched data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// Function to initialize and update the chart
function updateChart(data) {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar', //or 'line', 'pie', etc.
        data: {
            labels: data.map((item, index) => 'Record ${index + 1}'),  // Example labels
            datasets: [{
                label: 'Attendance Count',
                data: data.map(item => item[1]), // Replace with actual data index
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Call the function periodically to refresh the data
setInterval(fetchData, 5000);  // Fetch data every 5 seconds
