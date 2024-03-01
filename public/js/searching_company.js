function filterTable() {
    const input = document.getElementById('searching');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('styled-table');
    const rows = table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const name = rows[i].getElementsByTagName('td')[0]; // Column with student name
  
      if (name) {
        const nameText = name ? name.textContent || name.innerText : '';
  
        const matchFound =
          nameText.toUpperCase().indexOf(filter) > -1
  
        if (matchFound) {
          rows[i].style.display = '';
        } else {
          rows[i].style.display = 'none';
        }
      }
    }
  }