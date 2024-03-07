const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('left-bar');
const light_mode = document.getElementById('light-mode');
const dark_mode = document.getElementById('dark-mode');
const project = document.getElementById('project');

const modal_bg = document.getElementById('modal-back');
const modal_bg2 = document.getElementById('modal-back2');
const modal = document.getElementById('modal');
const modal3 = document.getElementById('modal3');
const add_user= document.getElementById('add-user');
const add_by_doc= document.getElementById('add-approval-docs');
const all_modal = document.querySelectorAll('.modal');
const stdid = document.getElementById('stdid2');
const dump = document.getElementById('dump');
const pop= document.getElementsByClassName('pop');
const all_pop = Array.from(pop); 
const sort = document.getElementById('sort2');

const deleteLink = document.querySelectorAll('#deleteLink');
const Link = Array.from(deleteLink);  

  if (sort) {
      if (sort.value !=  '1') {
          stdid.classList.add("close");
      }else{
          stdid.classList.remove("close");
      }
      sort.addEventListener('change', () => {

          if (sort.value !=  '1') {
              stdid.classList.add("close");
              dump.value = 'hide';
          }else{
              stdid.classList.remove("close");
              dump.value = '';
          }
      });
  }

menuBtn.addEventListener('click',()=>{
    // sidebar hide or show
    if(sideMenu.classList.contains('show-bar')){
      sideMenu.classList.remove('show-bar');
      sideMenu.classList.add('hide-bar');
      project.classList.add('close');
    }else{
      sideMenu.classList.remove('hide-bar');
      sideMenu.classList.add('show-bar');
      project.classList.remove('close');
    }
  });

if(deleteLink){
    Link.forEach((e,index) => {
        e.addEventListener('click', function (event) {

        var modalEditName = 'deleteForm'+ e.getAttribute('name').toString();
        const modalEdit = document.getElementById(modalEditName);
        event.preventDefault();
        modalEdit.submit();
});
    });

}

all_pop.forEach(function(user) { 
    user.addEventListener('click',()=>{
        var modalName = 'modal2'+ user.getAttribute('name').toString();
        const modalRequest = document.getElementById(modalName);
        modal_bg2.classList.remove('close');
        modalRequest.classList.remove('close');
    });
});

if(modal_bg2){
    modal_bg2.addEventListener('click',()=>{
    modal_bg2.classList.add('close');
    for (var i = 0; i < all_modal.length; i++) {
      all_modal[i].classList.add("close");
    }
  });
  }


if(modal_bg){
    modal_bg.addEventListener('click',()=>{
    modal_bg.classList.add('close');
    for (var i = 0; i < all_modal.length; i++) {
      all_modal[i].classList.add("close");
  
    }
  });
  }

  if(add_user){
    add_user.addEventListener('click',()=>{
    modal_bg.classList.remove('close');
    modal.classList.remove('close');
    console.log('ass');
  });
  }

  if(add_by_doc){
    add_by_doc.addEventListener('click',()=>{
    modal_bg.classList.remove('close');
    modal3.classList.remove('close');
    console.log('ass');
  });
  }

  function handleSortChange(selectElement) {
    var selectedValue = selectElement.value;
  
    // Redirect to the desired URL based on the selected value
    switch (selectedValue) {
        case '1':
            window.location.href = '/account';
            break;
        case '2':
            window.location.href = '/account?sort=2';
            break;
        default:
            window.location.href = '/docs-waiting';
            break;
            // Handle the default case or do nothing
    }
  }

  function formatID(inputField) {
  
    var inputValue = inputField.value.replace(/\D/g, ''); // Remove non-numeric characters
  
    // Add hyphen after the seventh digit
    if (inputValue.length >= 9 && inputValue.substring(9) != '-') {
        inputValue = inputValue.substring(0, 9) + '-' + inputValue.substring(9);
    }
  
    // Remove the hyphen if the user deletes characters
    if (inputField.value.length < 10) {
      inputValue = inputValue.substring(0, 9);
    }
  
  
    inputField.value = inputValue;
  }