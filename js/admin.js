
document.addEventListener('DOMContentLoaded', function() {
    // Проверка аутентификации
    if (!LibraryAPI.isAuthenticated()) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Инициализация панели управления
    initAdminPanel();
});

function initAdminPanel() {
    // Обновление приветствия
    updateWelcomeMessage();
    
    // Инициализация вкладок
    initTabs();
    
    // Инициализация кнопок быстрых действий
    initQuickActions();
    
    // Инициализация кнопок выхода
    initLogoutButtons();
    
    // Инициализация модальных окон
    initModals();
    
    // Загрузка данных
    loadBooks();
    loadReaders();
    loadBorrowedBooks();
}

// Обновление приветствия
function updateWelcomeMessage() {
    const user = LibraryAPI.getCurrentUser();
    const welcomeElement = document.getElementById('welcome-message');
    
    if (user && welcomeElement) {
        welcomeElement.textContent = `Добро пожаловать, ${user.full_name || user.email}!`;
    }
}

// Инициализация вкладок
function initTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Удаляем активный класс у всех вкладок
            tabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс текущей вкладке
            this.classList.add('active');
            
            // Скрываем все содержимое вкладок
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Показываем выбранное содержимое
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Кнопки обновления
    document.getElementById('refresh-books')?.addEventListener('click', loadBooks);
    document.getElementById('refresh-readers')?.addEventListener('click', loadReaders);
    document.getElementById('refresh-borrowed')?.addEventListener('click', loadBorrowedBooks);
}

// Инициализация кнопок быстрых действий
function initQuickActions() {
    document.getElementById('add-book-btn')?.addEventListener('click', showAddBookModal);
    document.getElementById('view-statistics-btn')?.addEventListener('click', showStatistics);
    
    // Остальные кнопки можно добавить позже
    document.getElementById('add-reader-btn')?.addEventListener('click', () => {
        showNotification('АААААААААААААААААААААА ПоПа', 'info');
    });
    
    document.getElementById('issue-book-btn')?.addEventListener('click', () => {
        showNotification('АААААААААААААААААААААА ПоПа', 'info');
    });
}

// Инициализация кнопок выхода
function initLogoutButtons() {
    const logoutLinks = [
        document.getElementById('logout-link'),
        document.getElementById('mobile-logout-link')
    ];
    
    logoutLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    });
}

// Инициализация модальных окон
function initModals() {
    // Закрытие модальных окон
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // Закрытие при клике вне модального окна
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Форма книги
    const bookForm = document.getElementById('book-form');
    if (bookForm) {
        bookForm.addEventListener('submit', handleBookSubmit);
    }
    
    // Подтверждение удаления
    document.getElementById('confirm-delete')?.addEventListener('click', confirmDelete);
}

// Загрузка книг
async function loadBooks() {
    const table = document.getElementById('books-table');
    const loading = document.getElementById('books-loading');
    
    if (!table || !loading) return;
    
    table.innerHTML = '';
    loading.classList.add('active');
    
    try {
        const data = await LibraryAPI.getBooks();
        
        if (data.books && data.books.length > 0) {
            data.books.forEach(book => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.genre || '-'}</td>
                    <td>${book.available_quantity} / ${book.quantity}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-edit" data-id="${book.id}">
                                <i class="fas fa-edit"></i> Изменить
                            </button>
                            <button class="btn btn-sm btn-delete" data-id="${book.id}">
                                <i class="fas fa-trash"></i> Удалить
                            </button>
                        </div>
                    </td>
                `;
                
                table.appendChild(row);
            });
            
            // Добавляем обработчики событий для кнопок
            table.querySelectorAll('.btn-edit').forEach(button => {
                button.addEventListener('click', function() {
                    const bookId = this.getAttribute('data-id');
                    showEditBookModal(bookId);
                });
            });
            
            table.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', function() {
                    const bookId = this.getAttribute('data-id');
                    showDeleteConfirmation(bookId, 'book');
                });
            });
        } else {
            table.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #6c757d;">
                        <i class="fas fa-book" style="font-size: 40px; margin-bottom: 10px; display: block;"></i>
                        Книги не найдены
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        showNotification(`Ошибка загрузки книг: ${error.message}`, 'error');
        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #dc3545;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 10px; display: block;"></i>
                    Ошибка загрузки данных
                </td>
            </tr>
        `;
    } finally {
        loading.classList.remove('active');
    }
}

// Загрузка читателей
async function loadReaders() {
    const table = document.getElementById('readers-table');
    const loading = document.getElementById('readers-loading');
    
    if (!table || !loading) return;
    
    table.innerHTML = '';
    loading.classList.add('active');
    
    try {
        const readers = await LibraryAPI.getReaders();
        
        if (readers && readers.length > 0) {
            readers.forEach(reader => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${reader.id}</td>
                    <td>${reader.full_name}</td>
                    <td>${reader.library_card}</td>
                    <td>${reader.phone || '-'}</td>
                    <td class="${reader.is_active ? 'status-active' : 'status-inactive'}">
                        ${reader.is_active ? 'Активен' : 'Неактивен'}
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-view" data-id="${reader.id}">
                                <i class="fas fa-eye"></i> Просмотр
                            </button>
                        </div>
                    </td>
                `;
                
                table.appendChild(row);
            });
        } else {
            table.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #6c757d;">
                        <i class="fas fa-users" style="font-size: 40px; margin-bottom: 10px; display: block;"></i>
                        Читатели не найдены
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        showNotification(`Ошибка загрузки читателей: ${error.message}`, 'error');
        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #dc3545;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 10px; display: block;"></i>
                    Ошибка загрузки данных
                </td>
            </tr>
        `;
    } finally {
        loading.classList.remove('active');
    }
}

// Загрузка выданных книг
async function loadBorrowedBooks() {
    const table = document.getElementById('borrowed-table');
    const loading = document.getElementById('borrowed-loading');
    
    if (!table || !loading) return;
    
    table.innerHTML = '';
    loading.classList.add('active');
    
    try {
        const borrowedBooks = await LibraryAPI.getBorrowedBooks();
        
        if (borrowedBooks && borrowedBooks.length > 0) {
            borrowedBooks.forEach(record => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>
                        <strong>${record.title}</strong><br>
                        <small>${record.author}</small>
                    </td>
                    <td>${record.reader_name}</td>
                    <td>${new Date(record.borrow_date).toLocaleDateString('ru-RU')}</td>
                    <td>${new Date(record.due_date).toLocaleDateString('ru-RU')}</td>
                    <td class="status-${record.status}">
                        ${record.status === 'issued' ? 'Выдана' : 
                          record.status === 'returned' ? 'Возвращена' : 'Просрочена'}
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-view" data-id="${record.id}">
                                <i class="fas fa-eye"></i> Просмотр
                            </button>
                        </div>
                    </td>
                `;
                
                table.appendChild(row);
            });
        } else {
            table.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #6c757d;">
                        <i class="fas fa-book-reader" style="font-size: 40px; margin-bottom: 10px; display: block;"></i>
                        Выданные книги не найдены
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        showNotification(`Ошибка загрузки выданных книг: ${error.message}`, 'error');
        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #dc3545;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 10px; display: block;"></i>
                    Ошибка загрузки данных
                </td>
            </tr>
        `;
    } finally {
        loading.classList.remove('active');
    }
}

// Показать модальное окно добавления книги
function showAddBookModal() {
    const modal = document.getElementById('book-modal');
    const title = document.getElementById('book-modal-title');
    const submitText = document.getElementById('book-submit-text');
    const form = document.getElementById('book-form');
    
    if (!modal || !title || !submitText || !form) return;
    
    // Сброс формы
    form.reset();
    document.getElementById('book-id').value = '';
    
    // Установка заголовка
    title.textContent = 'Добавить книгу';
    submitText.textContent = 'Добавить книгу';
    
    // Показ модального окна
    modal.classList.add('active');
}

// Показать модальное окно редактирования книги
async function showEditBookModal(bookId) {
    const modal = document.getElementById('book-modal');
    const title = document.getElementById('book-modal-title');
    const submitText = document.getElementById('book-submit-text');
    
    if (!modal || !title || !submitText) return;
    
    try {
        const book = await LibraryAPI.getBook(bookId);
        
        // Заполнение формы
        document.getElementById('book-id').value = book.id;
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-author').value = book.author;
        document.getElementById('book-genre').value = book.genre || '';
        document.getElementById('book-isbn').value = book.isbn || '';
        document.getElementById('book-year').value = book.publication_year || '';
        document.getElementById('book-publisher').value = book.publisher || '';
        document.getElementById('book-quantity').value = book.quantity || 1;
        
        // Установка заголовка
        title.textContent = 'Редактировать книгу';
        submitText.textContent = 'Сохранить изменения';
        
        // Показ модального окна
        modal.classList.add('active');
    } catch (error) {
        showNotification(`Ошибка загрузки книги: ${error.message}`, 'error');
    }
}

// Обработка отправки формы книги
async function handleBookSubmit(e) {
    e.preventDefault();
    
    const bookId = document.getElementById('book-id').value;
    const formData = {
        title: document.getElementById('book-title').value.trim(),
        author: document.getElementById('book-author').value.trim(),
        genre: document.getElementById('book-genre').value.trim() || null,
        isbn: document.getElementById('book-isbn').value.trim() || null,
        publication_year: document.getElementById('book-year').value || null,
        publisher: document.getElementById('book-publisher').value.trim() || null,
        quantity: parseInt(document.getElementById('book-quantity').value) || 1
    };
    
    // Валидация
    if (!formData.title || !formData.author) {
        showNotification('Заполните обязательные поля: название и автор', 'error');
        return;
    }
    
    if (formData.quantity < 1) {
        showNotification('Количество экземпляров должно быть не менее 1', 'error');
        return;
    }
    
    const submitBtn = document.getElementById('book-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Сохранение...';
    submitBtn.disabled = true;
    
    try {
        if (bookId) {
            // Редактирование существующей книги
            await LibraryAPI.updateBook(bookId, formData);
            showNotification('Книга успешно обновлена', 'success');
        } else {
            // Добавление новой книги
            await LibraryAPI.createBook(formData);
            showNotification('Книга успешно добавлена', 'success');
        }
        
        // Закрытие модального окна
        document.getElementById('book-modal').classList.remove('active');
        
        // Обновление списка книг
        loadBooks();
    } catch (error) {
        showNotification(`Ошибка сохранения: ${error.message}`, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Показать подтверждение удаления
function showDeleteConfirmation(id, type) {
    const modal = document.getElementById('confirm-modal');
    const message = document.getElementById('confirm-message');
    
    if (!modal || !message) return;
    
    // Сохраняем данные для удаления
    modal.dataset.deleteId = id;
    modal.dataset.deleteType = type;
    
    // Устанавливаем сообщение
    if (type === 'book') {
        message.textContent = 'Вы уверены, что хотите удалить эту книгу?';
    } else {
        message.textContent = 'Вы уверены, что хотите удалить эту запись?';
    }
    
    // Показываем модальное окно
    modal.classList.add('active');
}

// Подтверждение удаления
async function confirmDelete() {
    const modal = document.getElementById('confirm-modal');
    const id = modal.dataset.deleteId;
    const type = modal.dataset.deleteType;
    
    if (!id || !type) return;
    
    const deleteBtn = document.getElementById('confirm-delete');
    const originalText = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Удаление...';
    deleteBtn.disabled = true;
    
    try {
        if (type === 'book') {
            await LibraryAPI.deleteBook(id);
            showNotification('Книга успешно удалена', 'success');
            loadBooks();
        }
        
        // Закрытие модального окна
        modal.classList.remove('active');
    } catch (error) {
        showNotification(`Ошибка удаления: ${error.message}`, 'error');
    } finally {
        deleteBtn.innerHTML = originalText;
        deleteBtn.disabled = false;
    }
}

// Показать статистику
async function showStatistics() {
    try {
        const stats = await LibraryAPI.getStatistics();
        
        const message = `
            📊 Статистика библиотеки:\n
            • Книг в каталоге: ${stats.books}
            • Активных читателей: ${stats.readers}
            • Выдано книг: ${stats.borrowed}
            • Сотрудников: ${stats.employees}
        `;
        
        showNotification(message, 'info');
    } catch (error) {
        showNotification(`Ошибка загрузки статистики: ${error.message}`, 'error');
    }
}

// Выход из системы
function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        window.location.href = 'index.html';
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Удаляем старые уведомления
    document.querySelectorAll('.notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}