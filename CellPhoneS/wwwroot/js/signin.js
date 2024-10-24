const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const upName = document.getElementById('upname');
const upEmail = document.getElementById('upemail');
const upPassword = document.getElementById('uppassword');
const inEmail = document.getElementById('inemail');
const inPassword = document.getElementById('inpassword');
const btnSignIn = document.getElementById('btn_signin');
const btnSignUp = document.getElementById('btn_signup');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

function SignIn() {
    validateInputIn();
}

function SignUp() {
    validateInputUp();
}

const setDefault = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.remove('error');
    inputControl.classList.remove('success');
}

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputUp = () => {
    let isValid = true;

    if (upName.value.trim() === '') {
        setError(upName, 'Username is required');
        isValid = false;
    } else {
        setSuccess(upName);
    }

    if (upEmail.value.trim() === '') {
        setError(upEmail, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(upEmail.value.trim())) {
        setError(upEmail, 'Provide a valid email address');
        isValid = false;
    } else {
        setSuccess(upEmail);
    }

    if (upPassword.value.trim() === '') {
        setError(upPassword, 'Password is required');
        isValid = false;
    } else if (upPassword.value.trim().length < 8 || upPassword.value.trim().length > 16) {
        setError(upPassword, 'Password must be 8-16 characters.')
        isValid = false;
    } else {
        setSuccess(upPassword);
    }

    if (isValid) {

        $.ajax({
            type: "POST",
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            url: '/Account/SignUp',
            data: JSON.stringify({
                UserName: upName.value,
                Email: upEmail.value,
                Password: upPassword.value,
                Role: 'User'
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    alert('Account Created Successfully!')

                    upName.value = '';
                    upEmail.value = '';
                    upPassword.value = '';

                    setDefault(upName);
                    setDefault(upEmail);
                    setDefault(upPassword);
                }
                else {
                    alert(response.message);
                }
            },
            error: function (error) {
                alert('An error occurred:' + error.responseText);
            }
        });
    }
};

const validateInputIn = () => {

    let isValid = true;

    if (inEmail.value.trim() == '') {
        setError(inEmail, 'Email is required');

        isValid = false;
    } else if (!isValidEmail(inEmail.value.trim())) {
        setError(inEmail, 'Provide a valid email address');

        isValid = false;
    } else {
        setSuccess(inEmail);
    }

    if (inPassword.value.trim() == '') {
        setError(inPassword, 'Password is required');

        isValid = false;
    } else if (inPassword.value.trim().length < 8 || inPassword.value.trim().length > 16) {
        setError(inPassword, 'Password must be 8-16 characters.')

        isValid = false;
    } else {
        setSuccess(inPassword);
    }

    if (isValid) {

        $.ajax({
            type: 'POST',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            url: '/Account/SignIn',
            data: JSON.stringify({
                Email: inEmail.value,
                Password: inPassword.value
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    window.location.href = response.redirectUrl;
                }
                else {
                    alert(response.message);
                }
            },
            error: function (error) {
                alert('An error occurred:' + error.responseText);
            }
        });
    }
}