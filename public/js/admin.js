const modal_bg = document.getElementById('modal-back');
const modal = document.getElementById('modal');
const add_user= document.getElementById('add-user');
const all_modal = document.querySelectorAll('.modal');
const sort = document.getElementById('sort');
const stdid = document.getElementById('stdid');

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