const errMsgs = document.querySelectorAll(".error_msg");

//Functions

setTimeout(() => {
  errMsgs.forEach((msg) => {
    msg.classList.add("fade");
    msg.remove();
  });
}, 8000);

function showError(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");
  formControl.className = "form-control error";
  small.innerText = message;
}

function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}
