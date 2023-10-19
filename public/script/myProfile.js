window.addEventListener('load', async function () {
    const user_id = document.getElementById("user_id_temp_storage").value;
    

    const iconInput = document.querySelectorAll('input[name=icon]');
    iconInput.forEach(icon => {
        icon.addEventListener('click', () => {
            const iconImage = document.getElementById("my-profile-icon-image");
            iconImage.src = `/images/avatars/${icon.value}.png`;
        })
    })

    const updateIconButton = document.getElementById("update-icon-btn");
    const icon_container = document.getElementById("icon_container");

    updateIconButton.addEventListener('click', function (e) {
        console.log("click");
        if (icon_container.style.display === "block") {
            icon_container.style.display = "none";
        } else {
            icon_container.style.display = "block";
        }
        updateIconButton.classList.toggle('active');
    })


    // authentication
    const usernameInput = document.querySelector('#my_profile_username');
    const passwordInput = document.querySelector('#my_profile_passoword');
    const confirmPasswordInput = document.querySelector('#my_profile_comfirm_password');

    // error selectors
    const usernameError = document.querySelector('#username-error');
    const passwordFormatError = document.querySelector(
        '#password-format-error'
    );
    const passwordMatchError = document.querySelector('#password-match-error');
    const emailFormatError = document.querySelector(
        '#email-format-error'
    );

    await windowsOnLoadChecks();
    await addFormVerificationListeners();

    async function addFormVerificationListeners() {
        usernameInput.addEventListener('input', async () => {
            await checkUsernameInDb();
            registerButtonEnabler();
        });
        passwordInput.addEventListener('input', async () => {
            await checkValidPasswordFormat();
            await checkPasswordsMatch();
            registerButtonEnabler();
        });
        confirmPasswordInput.addEventListener('input', async () => {
            await checkPasswordsMatch();
            registerButtonEnabler();
        });
        emailInput.addEventListener('input', async () => {
            await checkValidEmailFormat();
            registerButtonEnabler();
        });
    }

    async function checkUsernameInDb() {
        const username = usernameInput.value;
        const response = await fetch(
            `/api/check-username?username=${username}`
        );
        let data = await response.text();
        if (data === 'username exists') {
            usernameError.style.display = '';
            usernameError.innerHTML = 'Username exists, please choose another';
            return false;
        } else {
            usernameError.style.display = 'none';
            usernameError.innerHTML = '';
        }
    }

    async function checkValidPasswordFormat() {
        const password = passwordInput.value;
        const response = await fetch(`/api/validate-password-format`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });
        let data = await response.text();
        if (data === 'valid') {
            passwordFormatError.style.display = 'none';
            passwordFormatError.innerHTML = '';
            return true;
        } else {
            passwordFormatError.style.display = '';
            passwordFormatError.innerHTML =
                'Password must be at least 5 characters long and include at least 1 special character';
            return false;
        }
    }

    async function checkValidEmailFormat() {
        const email = emailInput.value;
        const response = await fetch(`/api/validate-email-format`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        let data = await response.text();
        if (data === 'valid') {
            emailFormatError.style.display = 'none';
            emailFormatError.innerHTML = '';
            return true;
        } else {
            emailFormatError.style.display = '';
            emailFormatError.innerHTML =
                'Please input a valid email format';
            return false;
        }
    }

    async function checkPasswordsMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const response = await fetch(`/api/check-passwords-match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password, confirmPassword }),
        });
        let data = await response.text();
        if (data === 'passwords match') {
            passwordMatchError.style.display = 'none';
            passwordMatchError.innerHTML = '';
        } else {
            passwordMatchError.style.display = '';
            passwordMatchError.innerHTML = 'Please ensure passwords match';
        }
    }

    function registerButtonEnabler() {
        if (
            usernameError.style.display === 'none' &&
            passwordFormatError.style.display === 'none' &&
            passwordMatchError.style.display === 'none' &&
            emailFormatError.style.display === 'none'
        ) {
            registerButton.disabled = false;
            registerButton.style.opacity = '1.0';
        } else {
            registerButton.disabled = true;
            registerButton.style.opacity = '0.3';
        }
    }

    async function windowsOnLoadChecks() {
        formInputs.forEach(async (input) => {
            checkIfInputFocused(input);
        });
        await checkUsernameInDb();
        await checkValidPasswordFormat();
        await checkPasswordsMatch();
        await checkValidEmailFormat();
        registerButtonEnabler();
    }
});