let currentRole = '';

function showLogin(role) {
    currentRole = role;
    document.getElementById('loginTitle').innerText = `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`;
    document.getElementById('loginModal').style.display = 'block';
}

function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('errorMsg').innerText = '';
    document.getElementById('accessCode').value = '';
}

function checkAccess() {
    const accessCode = document.getElementById('accessCode').value;
    const correctCode = currentRole === 'admin' ? 'admin123' : 'user123';

    if (accessCode === correctCode) {
        window.location.href = `${currentRole}.html`;
    } else {
        document.getElementById('errorMsg').innerText = 'Incorrect Access Code';
    }
}

function addRow() {
    const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td><input type="text" name="number" placeholder="Number" required></td>
        <td><input type="text" name="department" placeholder="Department" required></td>
        <td><input type="text" name="pic" placeholder="PIC" required></td>
        <td><input type="text" name="itemName" placeholder="Item Name" required></td>
        <td><input type="number" name="quantity" placeholder="Quantity" required></td>
        <td><input type="date" name="returnDate" placeholder="Return Date" required></td>
        <td><input type="date" name="voucherDate" placeholder="Voucher Date" required></td>
        <td><button type="button" onclick="deleteRow(this)">Delete</button></td>
    `;
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function filterData() {
    const selectedMonth = document.getElementById('monthFilter').value;
    let userData = JSON.parse(localStorage.getItem('userData')) || [];
    let filteredData = userData.filter(row => {
        const returnDate = new Date(row.returnDate);
        return returnDate.getFullYear() + '-' + ('0' + (returnDate.getMonth() + 1)).slice(-2) === selectedMonth;
    });

    renderTable(filteredData);
}

function renderTable(data) {
    const tableBody = document.getElementById('userDataBody');
    tableBody.innerHTML = '';

    data.forEach(row => {
        let tr = document.createElement('tr');
        Object.values(row).forEach(cell => {
            let td = document.createElement('td');
            td.innerText = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    // Tampilkan tabel setelah data selesai dirender
    document.getElementById('userData').style.display = 'table';
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('admin.html')) {
        let userData = JSON.parse(localStorage.getItem('userData')) || [];
        renderTable(userData);
    }
});

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let formData = new FormData(this);
    let dataObject = {};
    formData.forEach((value, key) => {
        dataObject[key] = value;
    });

    let userData = JSON.parse(localStorage.getItem('userData')) || [];
    userData.push(dataObject);
    localStorage.setItem('userData', JSON.stringify(userData));

    document.getElementById('successMsg').style.display = 'block';
    this.reset();
});

function exportToExcel() {
    let userData = JSON.parse(localStorage.getItem('userData')) || [];
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Number,Department,PIC,Item Name,Quantity,Return Date,Voucher Date\n";
    userData.forEach(row => {
        let rowContent = Object.values(row).join(",");
        csvContent += rowContent + "\n";
    });
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
