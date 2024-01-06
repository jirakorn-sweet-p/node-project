const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('left-bar');
const light_mode = document.getElementById('light-mode');
const dark_mode = document.getElementById('dark-mode');
const modal_bg = document.getElementById('modal-back');
const modal = document.getElementById('modal');
const add_request = document.getElementById('boder-add-request');

if(add_request){
  add_request.addEventListener('click',()=>{
  modal_bg.classList.remove('close');
  modal.classList.remove('close');
});
}

if(modal_bg){
  modal_bg.addEventListener('click',()=>{
  modal_bg.classList.add('close');
  modal.classList.add('close');
});
}


menuBtn.addEventListener('click',()=>{
  // sidebar hide or show
  if(sideMenu.classList.contains('show-bar')){
    sideMenu.classList.remove('show-bar');
    sideMenu.classList.add('hide-bar');
  }else{
    sideMenu.classList.remove('hide-bar');
    sideMenu.classList.add('show-bar');
  }
});

light_mode.addEventListener('click',()=>{
  console.log('hi');
  if(light_mode.classList.contains('active')){
  light_mode.classList.remove('active');
  dark_mode.classList.add('active');
  document.body.classList.add('dark-mode-variables');
  }else if(dark_mode.classList.contains('active')){
  dark_mode.classList.remove('active');
  light_mode.classList.add('active');
  document.body.classList.remove('dark-mode-variables');
  }
});

dark_mode.addEventListener('click',()=>{
  console.log('hi');
  if(light_mode.classList.contains('active')){
  light_mode.classList.remove('active');
  dark_mode.classList.add('active');
  document.body.classList.add('dark-mode-variables');
  }else if(dark_mode.classList.contains('active')){
  dark_mode.classList.remove('active');
  light_mode.classList.add('active');
  document.body.classList.remove('dark-mode-variables');
  }
});
// config status section
function adjustNextElementPosition(detailsElement) {
  const nextElement = detailsElement.nextElementSibling;
  if (nextElement && nextElement.classList.contains("next-element")) {
    const isOpen = detailsElement.open;
    nextElement.style.marginTop = isOpen ? "10px" : "100px";
  }
}

