function filterTable() {
    const input = document.getElementById('searching');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('styled-table');
    const rows = table.getElementsByTagName('tr');
    const snf = document.getElementById('search-not-found');
    var count = 0;
    for (let i = 0; i < rows.length; i++) {
      const date = rows[i].getElementsByTagName('td')[0]; // Column with student name
      const name = rows[i].getElementsByTagName('td')[2]; // Column with student name
      const studentId = rows[i].getElementsByTagName('td')[1]; // Column with student ID
      const organization = rows[i].getElementsByTagName('td')[4]; // Column with organization name
      const position = rows[i].getElementsByTagName('td')[3]; // Column with organization name
      if (name || studentId || organization || date) {
        const dateText = date ? date.textContent || date.innerText : '';
        const nameText = name ? name.textContent || name.innerText : '';
        const studentIdText = studentId ? studentId.textContent || studentId.innerText : '';
        const organizationText = organization ? organization.textContent || organization.innerText : '';
        const positionText = position ? position.textContent || position.innerText : '';
        const matchFound =
          dateText.toUpperCase().indexOf(filter) > -1 ||
          nameText.toUpperCase().indexOf(filter) > -1 ||
          studentIdText.toUpperCase().indexOf(filter) > -1 ||
          organizationText.toUpperCase().indexOf(filter) > -1 ||
          positionText.toUpperCase().indexOf(filter) > -1;
        if (matchFound) {
          rows[i].style.display = '';
          count += 1;
        } else {
          rows[i].style.display = 'none';
        }
      }
    }
    if(count == 0){
      snf.classList.remove('close');
    }else{
      snf.classList.add('close');
    }
  }