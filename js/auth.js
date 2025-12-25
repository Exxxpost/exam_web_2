// Логика аутентификации и регистрации

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация страницы аутентификации
    initAuthPage();
    
    // Если пользователь уже авторизован, перенаправляем
    if (localStorage.getItem('isAuthenticated') === 'true') {
        window.location.href = 'admin.html';
    }
});

function initAuthPage() {
    // Инициализация переключения между формами
    initFormSwitching();
    
    // Инициализация полей пароля
    initPasswordFields();
    
    // Инициализация валидации
    initValidation();
    
    // Инициализация отправки форм
    initFormSubmission();
}

// Переключение между формами входа и регистрации
function initFormSwitching() {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchToRegisterLinks = document.querySelectorAll('.switch-to-register');
    const switchToLoginLinks = document.querySelectorAll('.switch-to-login');
    
    // Переключение по клику на вкладки
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', function(e) {
            e.preventDefault();
            switchToLogin();
        });
        
        registerTab.addEventListener('click', function(e) {
            e.preventDefault();
            switchToRegister();
        });
    }
    
    // Переключение по клику на ссылки в формах
    switchToRegisterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchToRegister();
        });
    });
    
    switchToLoginLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchToLogin();
        });
    });
    
    // Функции переключения
    function switchToLogin() {
        loginTab.classList.add('active');
        loginTab.setAttribute('aria-selected', 'true');
        loginForm.classList.add('active');
        loginForm.removeAttribute('hidden');
        
        registerTab.classList.remove('active');
        registerTab.setAttribute('aria-selected', 'false');
        registerForm.classList.remove('active');
        registerForm.setAttribute('hidden', 'true');
        
        // Очистка ошибок при переключении
        clearFormErrors(loginForm);
        clearFormErrors(registerForm);
        
        // Фокус на первое поле
        document.getElementById('login-email')?.focus();
    }
    
    function switchToRegister() {
        registerTab.classList.add('active');
        registerTab.setAttribute('aria-selected', 'true');
        registerForm.classList.add('active');
        registerForm.removeAttribute('hidden');
        
        loginTab.classList.remove('active');
        loginTab.setAttribute('aria-selected', 'false');
        loginForm.classList.remove('active');
        loginForm.setAttribute('hidden', 'true');
        
        // Очистка ошибок при переключении
        clearFormErrors(loginForm);
        clearFormErrors(registerForm);
        
        // Фокус на первое поле
        document.getElementById('register-fullname')?.focus();
    }
}

// Инициализация полей пароля (показать/скрыть)
function initPasswordFields() {
    // Для формы входа
    const loginPasswordToggle = document.getElementById('login-password-toggle');
    const loginPasswordInput = document.getElementById('login-password');
    
    if (loginPasswordToggle && loginPasswordInput) {
        loginPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(loginPasswordInput, loginPasswordToggle);
        });
    }
    
    // Для формы регистрации
    const registerPasswordToggle = document.getElementById('register-password-toggle');
    const registerPasswordInput = document.getElementById('register-password');
    
    if (registerPasswordToggle && registerPasswordInput) {
        registerPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(registerPasswordInput, registerPasswordToggle);
        });
        
        // Валидация пароля при вводе
        registerPasswordInput.addEventListener('input', function() {
            validatePasswordStrength(registerPasswordInput.value);
        });
    }
    
    // Для подтверждения пароля
    const registerConfirmToggle = document.getElementById('register-confirm-toggle');
    const registerConfirmInput = document.getElementById('register-confirm-password');
    
    if (registerConfirmToggle && registerConfirmInput) {
        registerConfirmToggle.addEventListener('click', function() {
            togglePasswordVisibility(registerConfirmInput, registerConfirmToggle);
        });
        
        // Валидация совпадения паролей
        registerConfirmInput.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }
}

// Переключение видимости пароля
function togglePasswordVisibility(passwordInput, toggleButton) {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = toggleButton.querySelector('i');
    if (type === 'text') {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        toggleButton.setAttribute('aria-label', 'Скрыть пароль');
    } else {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        toggleButton.setAttribute('aria-label', 'Показать пароль');
    }
}

// Валидация сложности пароля
function validatePasswordStrength(password) {
    const hints = {
        length: document.getElementById('length-hint'),
        uppercase: document.getElementById('uppercase-hint'),
        lowercase: document.getElementById('lowercase-hint'),
        number: document.getElementById('number-hint'),
        special: document.getElementById('special-hint')
    };
    
    const passwordHint = document.querySelector('.password-hint');
    
    if (!password) {
        passwordHint?.classList.remove('active');
        return false;
    }
    
    passwordHint?.classList.add('active');
    
    // Проверки
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-ZА-Я]/.test(password);
    const hasLowercase = /[a-zа-я]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    // Обновление подсказок
    updateHint(hints.length, hasMinLength);
    updateHint(hints.uppercase, hasUppercase);
    updateHint(hints.lowercase, hasLowercase);
    updateHint(hints.number, hasNumber);
    updateHint(hints.special, hasSpecial);
    
    // Возвращаем общую валидность
    return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

function updateHint(hintElement, isValid) {
    if (!hintElement) return;
    
    if (isValid) {
        hintElement.classList.add('valid');
        hintElement.classList.remove('invalid');
    } else {
        hintElement.classList.add('invalid');
        hintElement.classList.remove('valid');
    }
}

// Валидация совпадения паролей
function validatePasswordMatch() {
    const password = document.getElementById('register-password')?.value;
    const confirmPassword = document.getElementById('register-confirm-password')?.value;
    const errorElement = document.getElementById('register-confirm-error');
    
    if (!confirmPassword) {
        clearError('register-confirm');
        return false;
    }
    
    if (password !== confirmPassword) {
        showError('register-confirm', 'Пароли не совпадают');
        return false;
    } else {
        clearError('register-confirm');
        return true;
    }
}

// Инициализация валидации
function initValidation() {
    // Валидация email
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEmail(this.value, this.id);
        });
    });
    
    // Валидация обязательных полей
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateRequired(this.value, this.id);
        });
    });
}

// Валидация email
function validateEmail(email, fieldId) {
    const errorId = fieldId + '-error';
    
    if (!email) {
        showError(fieldId, 'Email обязателен');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError(fieldId, 'Введите корректный email адрес');
        return false;
    }
    
    clearError(fieldId);
    return true;
}

// Валидация обязательного поля
function validateRequired(value, fieldId) {
    if (!value.trim()) {
        showError(fieldId, 'Это поле обязательно для заполнения');
        return false;
    }
    
    clearError(fieldId);
    return true;
}

// Показать ошибку
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (input) {
        input.classList.add('error');
        input.classList.remove('success');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
    }
}

// Очистить ошибку
function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (input) {
        input.classList.remove('error');
        input.classList.add('success');
    }
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.removeAttribute('role');
    }
}

// Очистить все ошибки в форме
function clearFormErrors(form) {
    const errors = form.querySelectorAll('.error-message');
    errors.forEach(error => {
        error.textContent = '';
        error.removeAttribute('role');
    });
    
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
}

// Инициализация отправки форм
function initFormSubmission() {
    // Форма входа
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Форма регистрации
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Обработка входа
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Валидация
    const isEmailValid = validateEmail(email, 'login-email');
    const isPasswordValid = validateRequired(password, 'login-password');
    
    if (!isEmailValid || !isPasswordValid) {
        showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
        return;
    }
    
    // Показать индикатор загрузки
    const submitBtn = document.getElementById('login-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
    submitBtn.disabled = true;
    
    try {
        // Вызов API для входа
        const response = await LibraryAPI.login(email, password);
        
        if (response.success) {
            // Успешный вход
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', response.user.email);
            localStorage.setItem('userRole', response.user.role);
            localStorage.setItem('userName', response.user.full_name);
            
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            showNotification('Вход выполнен успешно!', 'success');
            
            // Перенаправление на панель управления
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
        } else {
            throw new Error('Неверные учетные данные');
        }
    } catch (error) {
        showNotification(error.message || 'Ошибка при входе', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Обработка регистрации
async function handleRegister(e) {
    e.preventDefault();
    console.log('Форма регистрации отправлена');
    
    const fullname = document.getElementById('register-fullname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const role = document.getElementById('register-role').value;
    
    console.log('Данные формы:', { fullname, email, password, confirmPassword, role });
    
    // Простая валидация
    if (!fullname || !email || !password || !confirmPassword || !role) {
        alert('Заполните все поля');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }
    
    // Показать индикатор загрузки
    const submitBtn = document.getElementById('register-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
    submitBtn.disabled = true;
    
    try {
        console.log('Отправка данных:', { fullname, email, password, role });
        
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullname, email, password, role })
        });
        
        console.log('Ответ сервера:', response.status);
        
        if (response.status === 201) {
            const result = await response.json();
            console.log('Успешная регистрация:', result);
            
            alert('Регистрация прошла успешно!');
            
            document.getElementById('register-form').reset();
            
            setTimeout(() => {
                const loginTab = document.getElementById('login-tab');
                if (loginTab) loginTab.click();
            }, 1000);
        } else {
            const error = await response.json();
            console.log('Ошибка регистрации:', error);
            alert(error.error || 'Ошибка регистрации');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при регистрации: ' + error.message);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Показать уведомление (используем функцию из main.js)
function showNotification(message, type = 'info') {
    if (window.showNotification) {
        window.showNotification(message, type);
    } else {
        // Фолбэк уведомление
        alert(message);
    }
}

// Восстановление пароля (простая реализация)
document.querySelector('.forgot-password')?.addEventListener('click', function(e) {
    e.preventDefault();
    
    const email = prompt('Введите ваш email для восстановления пароля:');
    if (email && validateEmail(email, 'forgot-email')) {
        showNotification('Инструкция по восстановлению пароля отправлена на ваш email', 'success');
    }
});