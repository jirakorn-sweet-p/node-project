const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('left-bar');
const light_mode = document.getElementById('light-mode');
const dark_mode = document.getElementById('dark-mode');

const modal_bg = document.getElementById('modal-back');
const modal_bg2 = document.getElementById('modal-back2');
const modal_bg_alert = document.getElementById('modal-alert');


const modal = document.getElementById('modal');
const modal2 = document.getElementById('modal2');
const modal3 = document.getElementById('modal3');
const modal_alert = document.getElementById('alert');

const all_modal = document.querySelectorAll('.modal');


const add_company= document.getElementById('add-btn');
const pop_position= document.getElementById('pop-position');
const add_position= document.getElementById('add-position');
const ok= document.getElementById('ok');


if (ok) { // Check if the element is found
  ok.addEventListener('click', () => {
    modal_alert.classList.add('close');
    modal_bg.classList.add('close');
  });
}
if(add_company){
  add_company.addEventListener('click',()=>{
    console.log('qweqweq');
    modal_bg.classList.remove('close');
    modal_bg.classList.remove('close');
    modal.classList.remove('close');
});
}

if(add_position){
  add_position.addEventListener('click',()=>{
  modal_bg2.classList.remove('close');
  modal3.classList.remove('close');
});
}

if(pop_position){
  pop_position.addEventListener('click',()=>{
  modal_bg.classList.remove('close');
  modal_bg.classList.remove('close');
  modal2.classList.remove('close');
  
});
}

if(modal_bg){
  modal_bg.addEventListener('click',()=>{
  modal_bg.classList.add('close');
  for (var i = 0; i < all_modal.length; i++) {
    all_modal[i].classList.add("close");
  }
  modal_alert.classList.add('close');
  modal_bg_alert.classList.add('close');
});
}

if(modal_bg2){
  modal_bg2.addEventListener('click',()=>{
  modal_bg2.classList.add('close');
  modal3.classList.add('close');
  modal_alert.classList.add('close');
  modal_bg_alert.classList.add('close');
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

function checkInput(inputField) {
  var inputValue = inputField.value.trim();
  var errorParagraph = inputField.nextElementSibling; // Assuming the <p> tag is always the next sibling

  if (inputValue === "") {
      errorParagraph.textContent = "This field is required";
  } else {
      errorParagraph.textContent = "*"; // Reset to default
  }
}

function checkInput(inputField) {
  var inputValue = inputField.value.trim();
  var errorParagraph = inputField.nextElementSibling; // Assuming the <p> tag is always the next sibling

  if (inputValue === "") {
      errorParagraph.textContent = "This field is required";
  } else {
      errorParagraph.textContent = "*"; // Reset to default
  }
}

function formatID(inputField) {
  var inputValue = inputField.value.replace(/\D/g, ''); // Remove non-numeric characters

  // Add hyphen after the seventh digit
  if (inputValue.length > 9) {
      inputValue = inputValue.substring(0, 9) + '-' + inputValue.substring(9);
  }

  // Remove the hyphen if the user deletes characters
  if (inputField.value.length < 10) {
    inputValue = inputValue.substring(0, 9);
  }
  inputField.value = inputValue;
}

function formatTEL(inputField) {
  var inputValue = inputField.value.replace(/\D/g, ''); // Remove non-numeric characters
  var telError = inputField.nextElementSibling; 

  // Add hyphen after the seventh digit
  if (inputValue.length >= 3) {
      inputValue = inputValue.substring(0, 3) + '-' + inputValue.substring(3);
  }

  // Remove the hyphen if the user deletes characters
  if (inputField.value.length < 4) {
    inputValue = inputValue.substring(0, 3);
  }
  if(inputField.value.length ==0){
    telError.textContent = "This field is required!"
  }else if (inputField.value.length !=11) {
    telError.textContent = "phone number not corrected!"
  }else if(inputField.value.length ==11){
    telError.textContent = ""
  }
  inputField.value = inputValue;
}

function formatTEL2(inputField) {
  var inputValue = inputField.value.replace(/\D/g, ''); // Remove non-numeric characters

  // Add hyphen after the seventh digit
  if (inputValue.length >= 3) {
      inputValue = inputValue.substring(0, 3) + '-' + inputValue.substring(3);
  }

  // Remove the hyphen if the user deletes characters
  if (inputField.value.length < 4) {
    inputValue = inputValue.substring(0, 3);
  }
  inputField.value = inputValue;
}

function formatGPA(inputField) {
  var inputValue = inputField.value.replace(/\D/g, ''); // Remove non-numeric characters

  // Add hyphen after the seventh digit
  if (inputValue.length >= 1) {
      inputValue = inputValue.substring(0, 1) + '.' + inputValue.substring(1);
  }

  // Remove the hyphen if the user deletes characters
  if (inputField.value.length < 2) {
    inputValue = inputValue.substring(0, 1);
  }

  if (parseFloat(inputValue) >4) {
    inputValue = '';

}
  inputField.value = inputValue;
}
