const cl = console.log;
const stdContainer = document.getElementById('stdContainer');
const stdForm = document.getElementById('stdForm');
const addStdBtn = document.getElementById('addStdBtn');
const updateStdBtn = document.getElementById('updateStdBtn');
const fnameControl = document.getElementById('fname');
const lnameControl = document.getElementById('lname');
const emailControl = document.getElementById('email');
const contactControl = document.getElementById('contact');


let stdArr = [];

if(localStorage.getItem('stdArr')){
	stdArr = JSON.parse(localStorage.getItem("stdArr"))
}

const uuid = () => {
  return String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(
    /[xy]/g,
    character => {
      const random = (Math.random() * 16) | 0
      const value = character === 'x' ? random : (random & 0x3) | 0x8
      return value.toString(16)
    }
  )
}

//################ 1. Templating (Read Student) #############################
function createTrs(arr) {
  let result = '';  
  arr.forEach((std, i) => {
    result += `
      <tr id="${std.stdId}"> 
        <td>${i + 1}</td>
        <td>${std.fname}</td>
		<td>${std.lname}</td>
        <td>${std.email}</td>
        <td>${std.contact}</td>

        <td class = "text-center">
          <i onclick="onStdEdit(this)"
            role="button"
            class="fa-solid fa-pen-to-square fa-2x text-success">
          </i>
        </td>

        <td class = "text-center">
          <i onclick="onStdRemove(this)"
            role="button"
            class="fa-solid fa-trash fa-2x text-danger">
          </i>
        </td>
      </tr>
    `;
  });
    
  stdContainer.innerHTML = result;
}
     createTrs(stdArr);


//################ 3. Remove Student #######################
function onStdRemove(ele) {
	// 1. GET REMOVED_ID
    let REMOVED_ID = ele.closest('tr').id;
	
    let getConfirm = confirm(
      `Are you sure, you want to remove the Student with ID ${REMOVED_ID} ?`
    )
	
    if (getConfirm) {
	     // 2. REMOVE OBJ FROM ARRAY USING ABOVE ID.
         let getIndex = stdArr.findIndex(std => {
             return std.stdId === REMOVED_ID;
         });
		 
		  let REMOVED_STD = stdArr.splice(getIndex, 1);
	
    //3. UPDATE ARRAY IN DB/LS 
       localStorage.setItem("stdArr", JSON.stringify(stdArr));
	
	// 4. REMOVE FROM UI.
       ele.closest('tr').remove();
	
	
	// 5. After Removing student we have to update serial number.
    let allTrs = [...document.querySelectorAll('#stdContainer tr')]
    allTrs.forEach((tr,i) => {
      tr.firstElementChild.innerText = i + 1 
    })

    snackBar(`The student with id ${REMOVED_ID} is Removed successfully !!!`, 'success')

    }
}
 


 const snackBar = (msg, icon) => {
	Swal.fire({
            icon: 'success',
            title: msg,
            timer: 3000
        }); 
 }
 
//###################### 2. Create Or Add Student ########################
// function onStdAddeve()
function onStdSubmit(eve) {
    eve.preventDefault();
	
	// new student object
    let NEW_STD = {
        fname: fnameControl.value,
        lname: lnameControl.value,
        email: emailControl.value,
        contact: contactControl.value,
        stdId: uuid()
    };
   // cl(NEW_STD);
   
    // added new OBJ in DB
    stdArr.push(NEW_STD);
	
	localStorage.setItem("stdArr", JSON.stringify(stdArr));

    stdForm.reset();

    let tr = document.createElement('tr');
    tr.id = NEW_STD.stdId;
    tr.innerHTML = `
        <td>${stdArr.length}</td>
        <td>${NEW_STD.fname} </td>
		<td>${NEW_STD.lname}</td>
        <td>${NEW_STD.email}</td>
        <td>${NEW_STD.contact}</td>

        <td class = "text-center">
          <i onclick="onStdEdit(this)"
            role="button"
            class="fa-solid fa-pen-to-square fa-2x text-success">
          </i>
        </td >

        <td class = "text-center">
          <i
onclick="onStdRemove(this)"
            role="button"
            class="fa-solid fa-trash fa-2x text-danger">
          </i>
        </td>`

    stdContainer.append(tr);

    snackBar(` The new student ${NEW_STD.fname} ${NEW_STD.lname} has been added successfully.`, 'success');
}

// ############################ 4. Edit & Update Student ##################


function onStdEdit (ele) {
	// GET ID
  let EDIT_ID = ele.closest('tr').id 
     localStorage.setItem('EDIT_ID', EDIT_ID); 
  
    // FIND OBJECT	
  let EDIT_OBJ = stdArr.find(std => {
    return std.stdId === EDIT_ID
  })
	
    // PATCH DATA	
  fnameControl.value = EDIT_OBJ.fname
  lnameControl.value = EDIT_OBJ.lname
  emailControl.value = EDIT_OBJ.email
  contactControl.value = EDIT_OBJ.contact

   
	 // HIDE ADD BTN & SHOW UPDATE BUTTON.
  addStdBtn.classList.add('d-none')
  updateStdBtn.classList.remove('d-none')
}


function onStdUpdate() {
  // update_ID

  let UPDATE_ID = localStorage.getItem("EDIT_ID") 

  // 1. GET UPDATED OBJ FROM form.
  let UPDATE_OBJ = {
    fname: fnameControl.value,
    lname: lnameControl.value,
    email: emailControl.value,
    contact: contactControl.value,
    stdId: UPDATE_ID
  }

  stdForm.reset();
  
  // 2. REPLACE/UPDATE IN ARRAY
  let getIndex = stdArr.findIndex(std => std.stdId === UPDATE_ID);
  stdArr[getIndex] = UPDATE_OBJ;

  // 3. UPDATE IN DB/ LS.
     localStorage.setItem("stdArr", JSON.stringify(stdArr));
	 
  // 4. UPDATE IN UI.
  let tr = document.getElementById(UPDATE_ID).children
  tr[1].innerText = `${UPDATE_OBJ.fname}`
  tr[2].innerText = `${UPDATE_OBJ.lname}`
  tr[3].innerText = `${UPDATE_OBJ.email}`
  tr[4].innerText = `${UPDATE_OBJ.contact}`
 

 // 5. hide update btn and show add btn
  addStdBtn.classList.remove('d-none')
  updateStdBtn.classList.add('d-none')

  snackBar(`The student ${UPDATE_OBJ.fname} ${UPDATE_OBJ.lname} is updated successfully !!!`, 'success');
  
}

stdForm.addEventListener('submit', onStdSubmit);
updateStdBtn.addEventListener('click', onStdUpdate)