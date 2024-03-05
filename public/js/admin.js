const modal_bg = document.getElementById('modal-back');
const modal_bg2 = document.getElementById('modal-back2');
const modal = document.getElementById('modal');
const modal3 = document.getElementById('modal3');
const add_user= document.getElementById('add-user');
const add_by_doc= document.getElementById('add-approval-docs');
const all_modal = document.querySelectorAll('.modal');
const sort = document.getElementById('sort');
const stdid = document.getElementById('stdid');

const pop= document.getElementsByClassName('pop');
const all_pop = Array.from(pop); 

const deleteLink = document.querySelectorAll('#deleteLink');
const Link = Array.from(deleteLink);  


if(deleteLink){
    Link.forEach((e,index) => {
        e.addEventListener('click', function (event) {

        var modalEditName = 'deleteForm'+ e.getAttribute('name').toString();
        console.log(modalEditName);
        const modalEdit = document.getElementById(modalEditName);
        console.log(modalEdit);
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


if (sort) {
    
    if (sort) {
        if (sort.value !=  '1') {
            stdid.classList.add("close");
        }else{
            stdid.classList.remove("close");
        }
        sort.addEventListener('change', () => {
            console.log(sort.value ==  '1');
            if (sort.value !=  '1') {
                stdid.classList.add("close");
            }else{
                stdid.classList.remove("close");
            }
        });
    }
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