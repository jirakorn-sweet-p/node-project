const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('left-bar');
const light_mode = document.getElementById('light-mode');
const dark_mode = document.getElementById('dark-mode');
const project = document.getElementById('project');

const modal_bg = document.getElementById('modal-back');
const modal = document.getElementById('modal');
const all_modal = document.querySelectorAll('.modal');
const add_request = document.getElementById('boder-add-request');
const add_document= document.getElementById('add-doc');

const edit_document= document.getElementsByClassName('edit-btn');
const documents = Array.from(edit_document);  
const details = document.getElementById('details');

const deleteLink = document.getElementById('deleteLink');
const deleteForm = document.getElementById('deleteForm');

const expand_reqInfo = document.getElementById('request-doc');
const expand_more = document.getElementById('expand_more');

if(expand_more){
  expand_more.addEventListener('click',()=>{
  console.log('asdasd');
  if(expand_reqInfo.classList.contains('active')){
      console.log('hiding to show');
      expand_reqInfo.classList.remove('active');
  }else{
      console.log('show to hiding');
      expand_reqInfo.classList.add('active');
  }   
});

}

if(deleteLink){
deleteLink.addEventListener('click', function (event) {
  console.log('asdadasdasdasd');
  event.preventDefault();
  deleteForm.submit();
});
}


editor.addEventListener('focusout',()=>{
  const editor = document.getElementById('editor');
  const allHtmlContent = editor.innerHTML;
  const startString = '<div class="ql-editor" contenteditable="true">';
  const endString = '</div><div class="ql-tooltip ql-hidden"><a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a><input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL"><a class="ql-action"></a><a class="ql-remove"></a></div>';
  var a = allHtmlContent.replace(startString, '');
  var b = a.replace(endString, '');
  var c = b.replace('<div class="ql-editor ql-blank" contenteditable="true">','')
  if(c == '<div class="ql-editor ql-blank" contenteditable="true"><p><br></p>'){
    c = '';
  }
  details.value = c;
  console.log(details.value)
});

if(add_document){
  add_document.addEventListener('click',()=>{
  modal_bg.classList.remove('close');
  modal.classList.remove('close');
  console.log('ass');
});
}


if(add_request){
  add_request.addEventListener('click',()=>{
  modal_bg.classList.remove('close');
  modal.classList.remove('close');
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

documents.forEach(function(button) {
  button.addEventListener('click',()=>{
    
    var modalEditName = 'modal'+ button.getAttribute('name').toString();
    console.log(modalEditName);
    const modalEdit = document.getElementById(modalEditName);
    modal_bg.classList.remove('close');
    modalEdit.classList.remove('close');

    modal_bg.addEventListener('click',()=>{
      modal_bg.classList.add('close');
      modalEdit.classList.add('close');
    });
  });
});

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
  if (inputValue.length >= 9 && inputValue.substring(9) != '-') {
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
