function filterTable() {
    const input = document.getElementById('searching');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('styled-table');
    const rows = table.getElementsByTagName('tr');
    const snf = document.getElementById('search-not-found');

    var count = 0;
    for (let i = 0; i < rows.length; i++) {
      const name = rows[i].getElementsByTagName('td')[0]; // Column with student name
      const studentId = rows[i].getElementsByTagName('td')[1]; // Column with student ID
      const organization = rows[i].getElementsByTagName('td')[2]; // Column with organization name
  
      if (name || studentId || organization) {
        const nameText = name ? name.textContent || name.innerText : '';
        const studentIdText = studentId ? studentId.textContent || studentId.innerText : '';
        const organizationText = organization ? organization.textContent || organization.innerText : '';
  
        const matchFound =
          nameText.toUpperCase().indexOf(filter) > -1 ||
          studentIdText.toUpperCase().indexOf(filter) > -1 ||
          organizationText.toUpperCase().indexOf(filter) > -1;
  
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