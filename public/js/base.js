const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('left-bar');
const light_mode = document.getElementById('light-mode');
const dark_mode = document.getElementById('dark-mode');
const project = document.getElementById('project');
const sort = document.getElementById('sort');
const modal_bg = document.getElementById('modal-back');
const modal = document.getElementById('modal');
const all_modal = document.querySelectorAll('.modal');
const add_request = document.getElementById('boder-add-request');
const add_document= document.getElementById('add-doc');
const serch_company= document.getElementById('search');

const find= document.getElementById('find');
const new_company= document.getElementById('new-company');
const found= document.getElementById('found');

const select = document.querySelectorAll('.pick');
const company = document.querySelectorAll('.company-name');
const company2 = document.getElementById('company-name2');
const province = document.querySelectorAll('.province');
const province2= document.getElementById('province2');
const address = document.querySelectorAll('.address');
const address2= document.getElementById('address2');
const district = document.querySelectorAll('.district');
const district2= document.getElementById('district2');
const subdistrict = document.querySelectorAll('.subdistrict');
const subdistrict2= document.getElementById('subdistrict2');
const provinceID = document.querySelectorAll('.provinceID');
const provinceID2= document.getElementById('provinceID2');
const tel = document.querySelectorAll('.tel');
const tel2= document.getElementById('tel2');
const type_business = document.querySelectorAll('.type_business');
const type_business2= document.getElementById('type_business2');


const edit_document= document.getElementsByClassName('edit-btn');
const documents = Array.from(edit_document); 

const pendding_request= document.getElementsByClassName('request-details');
const requests_pendding = Array.from(pendding_request);

const request_details = document.getElementById('request-details');
const expand_more = document.getElementById('expand_more');
const expand_more2 = document.getElementById('expand_more2');
const expand_more3 = document.getElementById('expand_more3');
const expand_reqInfo = document.getElementById('request-info');
const expand_reqDoc = document.getElementById('request-doc');
const expand_cer = document.getElementById('request-cer');

const overflowContainer= document.getElementsByClassName('over-flow');
const overflow = Array.from(overflowContainer);

        // Check if text overflow is occurring
if(overflowContainer){
  overflow.forEach(element => {
    element.addEventListener('input',()=>{
    
      if (element.scrollWidth > element.clientWidth) {
        element.style.direction = 'rtl'; // Apply RTL direction
        console.log('yes');
    }else{
        console.log('no');
        element.style.direction = 'ltr'; // Apply RTL direction
    }
    });
  });
  // address2.addEventListener('input',()=>{
    
  //   if (address2.scrollWidth > address2.clientWidth) {
  //     address2.style.direction = 'rtl'; // Apply RTL direction
  //     console.log('yes');
  // }else{
  //     console.log('no');
  //     address2.style.direction = 'ltr'; // Apply RTL direction
  // }
  // });
  
}
if (sort) {
    
  if (sort) {
      if (sort.value !=  '1') {
          stdid.classList.add("close");
      }else{
          stdid.classList.remove("close");
      }
      // console.log(stdid.classList);
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
}
if(select){
  for (var i = 0; i < select.length; i++) {
    let comp = company[i].textContent;
    let addr = address[i].textContent;
    let dist = district[i].textContent;
    let sub = subdistrict[i].textContent;
    let provId = provinceID[i].textContent;
    let t = tel[i].textContent;
    let pro = province[i].textContent;
    let type = type_business[i].textContent;

    select[i].addEventListener('click',()=>{
      modal_bg.classList.add('close');
      modal.classList.add('close');
      company2.value = comp;
      find.value = comp;
      address2.value = addr;
      district2.value = dist;
      subdistrict2.value = sub;
      provinceID2.value = provId;
      tel2.value = t;
      province2.value = pro;
      type_business2.value = type;
      
      serch_company.innerHTML = "<span class='material-icons-sharp'>search</span>";
      new_company.innerHTML = "<span class='material-icons-sharp'>add</span>";
      
      found.value = "match";
      find.classList.remove('close');
      new_company.classList.add('close');
    });
  }
};


if(new_company){
  new_company.addEventListener('click',()=>{
    find.classList.remove('close');
    serch_company.innerHTML = "<span class='material-icons-sharp'>search</span>";
    new_company.innerHTML = "<span class='material-icons-sharp'>add</span>";
    found.value = "not-match";
    new_company.classList.add('close');
});
}



if(serch_company){
  serch_company.addEventListener('click',()=>{
  modal_bg.classList.remove('close');
  modal.classList.remove('close');
});
}

if(add_document){
  add_document.addEventListener('click',()=>{
  modal_bg.classList.remove('close');
  modal.classList.remove('close');
});
}
if(expand_more3){
expand_more3.addEventListener('click',()=>{
  if(expand_cer.classList.contains('active')){
          console.log('hiding to show');
          expand_cer.classList.remove('active');
    }else{
          console.log('show to hiding');
          expand_cer.classList.add('active');
  }
});
}

if(expand_more2){
expand_more2.addEventListener('click',()=>{
  if(expand_reqDoc.classList.contains('active')){
          console.log('hiding to show');
          expand_reqDoc.classList.remove('active');
    }else{
          console.log('show to hiding');
          expand_reqDoc.classList.add('active');
  }
});
}
if(expand_more){
expand_more.addEventListener('click',()=>{
  if(expand_reqInfo.classList.contains('active')){
          console.log('hiding to show');
          expand_reqInfo.classList.remove('active');
    }else{
          console.log('show to hiding');
        expand_reqInfo.classList.add('active');
  }
});
}




requests_pendding.forEach(function(request) {
  request.addEventListener('click',()=>{
    modal_bg.classList.remove('close');

    var modalName = 'modal'+ request.getAttribute('name').toString();
    console.log(modalName);
    const modalRequest = document.getElementById(modalName);
    modal_bg.classList.remove('close');
    modalRequest.classList.remove('close');
    
    modal_bg.addEventListener('click',()=>{
      modal_bg.classList.add('close');
      modalRequest.classList.add('close');
    });
  });
});




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
if(light_mode){light_mode.addEventListener('click',()=>{
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
});}

if(dark_mode){dark_mode.addEventListener('click',()=>{
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
});}

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

function handleSortChange(selectElement) {
  var selectedValue = selectElement.value;

  // Redirect to the desired URL based on the selected value
  switch (selectedValue) {
      case '1':
          window.location.href = '/company';
          break;
      case '2':
          window.location.href = '/company?sort=2';
          break;
      default:
          window.location.href = '/company';
          break;
          // Handle the default case or do nothing
  }
}