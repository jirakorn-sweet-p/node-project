const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('left-bar');
const light_mode = document.getElementById('light-mode');
const dark_mode = document.getElementById('dark-mode');

//modal
const modal_bg = document.getElementById('modal-back');
const modal_bg2 = document.getElementById('modal-back2');
const modal = document.getElementById('modal');
const all_modal = document.querySelectorAll('.modal');
const add_request = document.getElementById('boder-add-request');
// const serch_company= document.getElementById('search');

const edit_document= document.getElementsByClassName('edit-btn');
const documents = Array.from(edit_document); 

const pendding_request= document.getElementsByClassName('request-details');
const requests_pendding = Array.from(pendding_request); 

const request_details = document.getElementById('request-details');
const em1= document.querySelectorAll('.expand_more');
const em2= document.querySelectorAll('.expand_more2');
const em3= document.querySelectorAll('.expand_more3');
const em4= document.querySelectorAll('.expand_more4');
const em5= document.querySelectorAll('.expand_more5');
const em6= document.querySelectorAll('.expand_more6');
const approval = document.getElementById('approval-docs');

const modal_alert = document.getElementById('alert');
const modal_bg_alert = document.getElementById('modal-alert');
const ok= document.getElementById('ok');

const approval_docs_modal = document.getElementById('approval-docs-modal');
const approval_docs_modal2 = document.getElementById('approval-docs-modal2');

// const new_company = document.getElementById('new-company');

const deleteLink = document.querySelectorAll('#new-company');
const Link = Array.from(deleteLink);  
//check box 
const cbx5 = document.getElementById('cb5');
const cbx = document.getElementById('cbx');

const pop_position = document.getElementById('pop-position');
const add_approval_docs= document.getElementById('add-approval-docs');
const th_checkbox= document.getElementsByClassName('th-checkbox');
const th_cbx = Array.from(th_checkbox); 
const td_checkbox= document.getElementsByClassName('td-checkbox');
const td_cbx = Array.from(td_checkbox); 

// form

const generate= document.getElementById('generate');
const genbtn = document.getElementsByClassName('generate');
const generateBtn = Array.from(genbtn); 
const inp_cbx= document.getElementsByClassName('inp-cbx');
const checked = Array.from(inp_cbx); 
const inp_cb2= document.getElementsByClassName('inp-cbx2');
const checked2 = Array.from(inp_cb2); 
const inp_cb3= document.getElementsByClassName('inp-cbx3');
const checked3 = Array.from(inp_cb3); 

const generateStartDate = document.getElementById('generateStartDate');
const generateEndDate = document.getElementById('generateEndDate');
const data_generate = document.getElementsByClassName('data-generate');
const data_gen = Array.from(data_generate);
const table_generate = document.getElementsByClassName('table-gen');
const table_gen = Array.from(table_generate);

if (generateStartDate) {
  generateStartDate.addEventListener('change', () => {
    const ids = data_gen.map(element => element.id);
    var bef = "";
    var next = "";
    var cur = "";
    ids.forEach((element,index) => {
      const splitArray = element.split('-');
      const date_gen = new Date(splitArray[2]);
      const temp_start = new Date(generateStartDate.value);
      
      

        cur = ids[index].split('-')[0];
        if(ids[index+1]){
          next = ids[index+1].split('-')[0];
        }else{
          next = "";
        }
        console.log('bef',bef);
        console.log('cur',cur);
        console.log('next',next);
        if(bef == "" && next == ""){
          console.log("delete1 : ",cur);
          table_generate[Number(cur)].classList.add('close');
        }

        if(bef == "" && next != cur){
          console.log("delete2 : ",cur);
          table_generate[Number(cur)].classList.add('close');
        }

        if(bef != cur && next == ""){
          console.log("delete3 : ",cur);
          table_generate[Number(cur)].classList.add('close');
        }
        console.log(next != cur);
        if(bef != cur && next != cur && bef != "" && next != "" ){
          console.log("delete4 : ",cur);
          table_generate[Number(cur)].classList.add('close');
        }
          bef = cur;
          cur = next;            
      

          if(temp_start <= date_gen){
            if(checked3[index]){
              inp_cb3[index].checked = 'on';
              table_generate[Number(index)].classList.remove('close');
            }
          }else{
            if(checked3[index]){
              inp_cb3[index].checked = '';
            }
          }
    });
    
  });
}

if (generateEndDate) {
  generateEndDate.addEventListener('change', () => {
    const ids = data_gen.map(element => element.id);
    ids.forEach((element,index) => {
      const splitArray = element.split('-');
      const date_gen = new Date(splitArray[3]);
      const temp_end = new Date(generateEndDate.value);
      console.log(date_gen);
      if(splitArray[0] === splitArray[2]){
        if(temp_end >= date_gen){
          console.log(data_gen[splitArray[4]]);
        }
      }
    });
    
  });
}

if (pop_position) { // Check if the element is found
  pop_position.addEventListener('click', () => {
    approval_docs_modal.classList.remove('close');
    modal_bg2.classList.remove('close');
  });
}

if (add_approval_docs) { // Check if the element is found
  add_approval_docs.addEventListener('click', () => {
    approval_docs_modal2.classList.remove('close');
    modal_bg2.classList.remove('close');
  });
}

// if (modal_bg2) { // Check if the element is found
//   modal_bg2.addEventListener('click', () => {
//     approval_docs_modal.classList.add('close');
//     modal_bg2.classList.add('close');
//   });
// }

if (generateBtn.length > 0) { // Check if elements are found
  generateBtn.forEach(function (btn, index) {
    btn.addEventListener('click', () => {
      console.log('sdfsdfdsfasdf');
    });
  });
}

if(checked2){
  checked2.forEach(function(cb,index) {
    cb.addEventListener('change',()=>{
      inp_cbx[index].checked = cb.checked;
    });
  });
}

if(checked){
  checked.forEach(function(cb,index) {
    cb.addEventListener('change',()=>{
      inp_cb2[index].checked = cb.checked;
    });
  });
}

if (cbx5) { // Check if the element is found
  cbx5.addEventListener('click', () => {
    if(!cbx5.checked){
      pop_position.classList.remove('close');
      th_cbx.forEach(function(cb,index) {
        cb.classList.remove('close');
        cb.classList.remove('close');
      });
      td_cbx.forEach(function(cb,index) {
        cb.classList.remove('close');
        cb.classList.remove('close');
      });
    }else{
      pop_position.classList.add('close');

      th_cbx.forEach(function(cb,index) {
        cb.classList.add('close');
        cb.classList.add('close');
      });
      td_cbx.forEach(function(cb,index) {
        cb.classList.add('close');
        cb.classList.add('close');
      });
    }
  });
}

// if (new_company) { // Check if the element is found
//   new_company.addEventListener('click', () => {
//     modal_alert.classList.remove('close');
//     modal_bg_alert.classList.remove('close');
//   });
// }

if(deleteLink){
  Link.forEach((e,index) => {
      // modal_alert.classList.remove('close');
      // modal_bg_alert.classList.remove('close')
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

if (ok) { // Check if the element is found
  ok.addEventListener('click', () => {
    modal_alert.classList.add('close');
    modal_bg_alert.classList.add('close');
    modal_bg2.classList.add('close');
  });
}

// if(serch_company){
//   serch_company.addEventListener('click',()=>{
//   modal_bg.classList.remove('close');
//   modal.classList.remove('close');
// });
// }

  if(em1){
    for (var i = 0; i < em1.length; i++) {
      const expand_reqInfo = document.getElementById('request-info'+i);
      const expand_more = document.getElementById('expand_more'+i);
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
  }
  if(em2){
    for (var i = 0; i < em2.length; i++) {
      const expand_Doc = document.getElementById('request-Doc'+i);
      const expand_more = document.getElementById('expand_more2'+i);
      expand_more.addEventListener('click',()=>{
            if(expand_Doc.classList.contains('active')){
              console.log('hiding to show');
              expand_Doc.classList.remove('active');
            }else{
              console.log('show to hiding');
              expand_Doc.classList.add('active');
            }   
      });
    }
  }
  if(em3){
    for (var i = 0; i < em3.length; i++) {
      const expand_cer = document.getElementById('request-cer'+i);
      const expand_more = document.getElementById('expand_more3'+i);
      expand_more.addEventListener('click',()=>{
            if(expand_cer.classList.contains('active')){
              console.log('hiding to show');
              expand_cer.classList.remove('active');
            }else{
              console.log('show to hiding');
              expand_cer.classList.add('active');
            }   
      });
    }
  }
  if(em4){
    for (var i = 0; i < em4.length; i++) {
      const approval_docs = document.getElementById('approval-docs'+i);
      const expand_more = document.getElementById('expand_more4'+i);
      expand_more.addEventListener('click',()=>{
            if(approval_docs.classList.contains('active')){
              console.log('hiding to show');
              approval_docs.classList.remove('active');
            }else{
              console.log('show to hiding');
              approval_docs.classList.add('active');
            }   
      });
    }
  }
  if(em5){
    for (var i = 0; i < em5.length; i++) {
      const approval_docs = document.getElementById('approval-docs2'+i);
      const expand_more = document.getElementById('expand_more5'+i);
      expand_more.addEventListener('click',()=>{
            if(approval_docs.classList.contains('active')){
              console.log('hiding to show');
              approval_docs.classList.remove('active');
            }else{
              console.log('show to hiding');
              approval_docs.classList.add('active');
            }   
      });
    }
  }

  if(em6){
    for (var i = 0; i < em6.length; i++) {
      const approval_docs = document.getElementById('approval-docs3'+i);
      const expand_more = document.getElementById('expand_more6'+i);
      expand_more.addEventListener('click',()=>{
            if(approval_docs.classList.contains('active')){
              console.log('hiding to show');
              approval_docs.classList.remove('active');
            }else{
              console.log('show to hiding');
              approval_docs.classList.add('active');
            }   
      });
    }
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
  }else{
    sideMenu.classList.remove('hide-bar');
    sideMenu.classList.add('show-bar');
  }
});

if(light_mode){
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
}

if(dark_mode){
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
}

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

function handleSortChange(selectElement) {
  var selectedValue = selectElement.value;

  // Redirect to the desired URL based on the selected value
  switch (selectedValue) {
      case '1':
          window.location.href = '/docs-waiting';
          break;
      case '2':
          window.location.href = '/docs-waiting?sort=2';
          break;
      case '3':
          window.location.href = '/docs-waiting?sort=3';
          break;
      case '4':
          window.location.href = '/docs-waiting?sort=4';
          break;
      // Add more cases as needed for other options
      default:
          window.location.href = '/docs-waiting';
          break;
          // Handle the default case or do nothing
  }
}

function handleSortChange2(selectElement) {
  var selectedValue = selectElement.value;

  // Redirect to the desired URL based on the selected value
  switch (selectedValue) {
      case '1':
          window.location.href = '/docs-approve';
          break;
      case '2':
          window.location.href = '/docs-approve?sort=2';
          break;
      case '3':
          window.location.href = '/docs-approve?sort=3';
          break;
      case '4':
          window.location.href = '/docs-approve?sort=4';
          break;
      // Add more cases as needed for other options
      default:
          window.location.href = '/docs-approve';
          break;
          // Handle the default case or do nothing
  }
}

function handleSortChange3(selectElement) {
  var selectedValue = selectElement.value;

  // Redirect to the desired URL based on the selected value
  switch (selectedValue) {
      case '1':
          window.location.href = '/docs-accepted';
          break;
      case '2':
          window.location.href = '/docs-accepted?sort=2';
          break;
      case '3':
          window.location.href = '/docs-accepted?sort=3';
          break;
      case '4':
          window.location.href = '/docs-accepted?sort=4';
          break;
      // Add more cases as needed for other options
      default:
          window.location.href = '/docs-accepted';
          break;
          // Handle the default case or do nothing
  }
}

function handleSortChange4(selectElement) {
  var selectedValue = selectElement.value;

  // Redirect to the desired URL based on the selected value
  switch (selectedValue) {
      case '1':
          window.location.href = '/docs-certificate';
          break;
      case '2':
          window.location.href = '/docs-certificate?sort=2';
          break;
      case '3':
          window.location.href = '/docs-certificate?sort=3';
          break;
      case '4':
          window.location.href = '/docs-certificate?sort=4';
          break;
      // Add more cases as needed for other options
      default:
          window.location.href = '/docs-certificate';
          break;
          // Handle the default case or do nothing
  }
}

