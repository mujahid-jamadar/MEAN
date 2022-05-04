
function registerSubmit() {
    if (isValidRegistration()) {

        return true;
    }
    else{
      document.register.password.focus();
      return false;
    }
}

function isValidRegistration() {
    var isValid = true;
    if(!checkPasswords()) isValid = false;
    return isValid;
}

function checkPasswords() {
    var p1 = document.getElementById('password');
    var p2 = document.getElementById('password2');
    var p3 = document.getElementById('oldpassword');

    if (p1.value.length < 6) {
        alert("Error: The password must contain at least six characters.");
        return false;
    }
    if (!(/[0-9]/.test(p1.value))) {
        alert("Error: The password must contain at least one number.");
        return false;
    }
    if(p1.value !== p2.value) {
        alert("Error: The two passwords you entered are not the same.");
        return false;
    }
    if((p3.value.length!=0)&(p3.value==p1.value)){
        alert('Old and New Password are the same.');
        return false;
    }
    return true;
}
