function startAttendance() {
    fetch('/start_attendance')
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error:', error));
}

function viewAttendance() {
    fetch('/view_attendance')
        .then(response => response.json())
        .then(data => {
            const attendanceList = document.getElementById('attendance-list');
            attendanceList.innerHTML = '';
            data.records.forEach(record => {
                const recordElement = document.createElement('div');
                recordElement.className = 'attendance-record';
                recordElement.textContent = `ID: ${record.id} | Name: ${record.name} | Time: ${record.time} | Date: ${record.date}`;
                attendanceList.appendChild(recordElement);
            });
        })
        .catch(error => console.error('Error:', error));
}
