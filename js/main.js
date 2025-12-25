// Основной JavaScript файл для главной страницы

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Загрузка статистики
    loadStatistics();
    
    // Обновление ссылок в зависимости от состояния аутентификации
    updateAuthLinks();
});

// Инициализация гамбургер-меню
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Закрытие меню при клике на ссылку
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Загрузка статистики (заглушка - в реальном приложении будет запрос к API)
function loadStatistics() {
    // В реальном приложении здесь будет fetch запрос к API
    setTimeout(() => {
        document.getElementById('books-count').textContent = '1245';
        document.getElementById('readers-count').textContent = '342';
        document.getElementById('borrowed-count').textContent = '189';
        document.getElementById('available-count').textContent = '1056';
    }, 500);
}

// Обновление ссылок аутентификации
function updateAuthLinks() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const authLink = document.getElementById('auth-link');
    const mobileAuthLink = document.getElementById('mobile-auth-link');
    
    if (isAuthenticated) {
        if (authLink) {
            authLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Выйти';
            authLink.href = '#';
            authLink.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
        
        if (mobileAuthLink) {
            mobileAuthLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Выйти';
            mobileAuthLink.href = '#';
            mobileAuthLink.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    }
}

// Выход из системы
function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        
        // Обновляем страницу
        window.location.href = 'index.html';
    }
}

// Простое уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = 'var(--success-color)';
    } else if (type === 'error') {
        notification.style.backgroundColor = 'var(--danger-color)';
    } else if (type === 'warning') {
        notification.style.backgroundColor = 'var(--warning-color)';
    } else {
        notification.style.backgroundColor = 'var(--primary-color)';
    }
    
    document.body.appendChild(notification);
    
    // Автоматическое удаление уведомления через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Добавляем стили для анимаций уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);