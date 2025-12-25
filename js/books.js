// Логика каталога книг

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация страницы каталога
    initBooksPage();
});

function initBooksPage() {
    // Загрузка книг
    loadBooks();
    
    // Инициализация поиска
    initSearch();
    
    // Инициализация фильтров
    initFilters();
    
    // Инициализация пагинации
    initPagination();
    
    // Обновление ссылок аутентификации
    updateAuthLinks();
}

// Тестовые данные книг
const mockBooks = [
    {
        id: 1,
        title: "Мастер и Маргарита",
        author: "Михаил Булгаков",
        genre: "Роман",
        year: 1966,
        available: 3,
        total: 5,
        status: "available"
    },
    {
        id: 2,
        title: "Преступление и наказание",
        author: "Федор Достоевский",
        genre: "Роман",
        year: 1866,
        available: 0,
        total: 4,
        status: "borrowed"
    },
    {
        id: 3,
        title: "Война и мир",
        author: "Лев Толстой",
        genre: "Роман-эпопея",
        year: 1869,
        available: 2,
        total: 4,
        status: "available"
    },
    {
        id: 4,
        title: "1984",
        author: "Джордж Оруэлл",
        genre: "Антиутопия",
        year: 1949,
        available: 1,
        total: 2,
        status: "available"
    },
    {
        id: 5,
        title: "Гарри Поттер и философский камень",
        author: "Дж. К. Роулинг",
        genre: "Фэнтези",
        year: 1997,
        available: 5,
        total: 6,
        status: "available"
    },
    {
        id: 6,
        title: "Три товарища",
        author: "Эрих Мария Ремарк",
        genre: "Роман",
        year: 1936,
        available: 2,
        total: 3,
        status: "available"
    },
    {
        id: 7,
        title: "Маленький принц",
        author: "Антуан де Сент-Экзюпери",
        genre: "Философская сказка",
        year: 1943,
        available: 0,
        total: 2,
        status: "borrowed"
    },
    {
        id: 8,
        title: "Убить пересмешника",
        author: "Харпер Ли",
        genre: "Роман",
        year: 1960,
        available: 1,
        total: 2,
        status: "available"
    },
    {
        id: 9,
        title: "Властелин колец",
        author: "Дж. Р. Р. Толкин",
        genre: "Фэнтези",
        year: 1954,
        available: 3,
        total: 4,
        status: "available"
    },
    {
        id: 10,
        title: "Гордость и предубеждение",
        author: "Джейн Остин",
        genre: "Роман",
        year: 1813,
        available: 2,
        total: 3,
        status: "available"
    }
];

// Переменные состояния
let currentBooks = [...mockBooks];
let filteredBooks = [...mockBooks];
let currentPage = 1;
const booksPerPage = 5;

// Загрузка книг
function loadBooks() {
    // В реальном приложении здесь будет fetch запрос к API
    // const data = await LibraryAPI.getBooks();
    
    // Используем тестовые данные
    renderBooks();
    updateBooksCount();
}

// Отрисовка книг
function renderBooks() {
    const tableBody = document.getElementById('books-table-body');
    const cardsContainer = document.getElementById('books-cards');
    
    if (!tableBody || !cardsContainer) return;
    
    // Очистка
    tableBody.innerHTML = '';
    cardsContainer.innerHTML = '';
    
    // Рассчитываем, какие книги показывать для текущей страницы
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToShow = filteredBooks.slice(startIndex, endIndex);
    
    // Если книг нет
    if (booksToShow.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #6c757d;">
                    <i class="fas fa-book-open" style="font-size: 40px; margin-bottom: 10px; display: block;"></i>
                    Книги не найдены
                </td>
            </tr>
        `;
        
        cardsContainer.innerHTML = `
            <div class="no-books" style="text-align: center; padding: 40px; color: #6c757d;">
                <i class="fas fa-book-open" style="font-size: 40px; margin-bottom: 10px; display: block;"></i>
                Книги не найдены
            </div>
        `;
        return;
    }
    
    // Отрисовка таблицы (для десктопа)
    booksToShow.forEach(book => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.year}</td>
            <td>${book.available} / ${book.total}</td>
            <td class="${book.status === 'available' ? 'status-available' : 'status-borrowed'}">
                ${book.status === 'available' ? 'Доступна' : 'Выдана'}
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Отрисовка карточек (для мобильных)
    booksToShow.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        
        card.innerHTML = `
            <div class="book-card-header">
                <div>
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                </div>
                <span class="${book.status === 'available' ? 'status-available' : 'status-borrowed'}">
                    ${book.status === 'available' ? '✓ Доступна' : '✗ Выдана'}
                </span>
            </div>
            
            <div class="book-details">
                <div class="book-detail">
                    <span>Жанр:</span> ${book.genre}
                </div>
                <div class="book-detail">
                    <span>Год:</span> ${book.year}
                </div>
                <div class="book-detail">
                    <span>Доступно:</span> ${book.available} из ${book.total}
                </div>
            </div>
        `;
        
        cardsContainer.appendChild(card);
    });
    
    // Обновление пагинации
    updatePagination();
}

// Обновление счетчика книг
function updateBooksCount() {
    const countElement = document.getElementById('books-count');
    if (countElement) {
        countElement.textContent = filteredBooks.length;
    }
}

// Инициализация поиска
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        // Поиск при нажатии Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Поиск при клике на кнопку
        searchBtn.addEventListener('click', performSearch);
    }
}

// Выполнение поиска
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredBooks = [...currentBooks];
    } else {
        filteredBooks = currentBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    renderBooks();
    updateBooksCount();
}

// Инициализация фильтров
function initFilters() {
    const genreFilter = document.getElementById('genre-filter');
    const availabilityFilter = document.getElementById('availability-filter');
    const sortFilter = document.getElementById('sort-filter');
    const resetBtn = document.getElementById('reset-filters');
    
    // Применение фильтров при изменении
    if (genreFilter) {
        genreFilter.addEventListener('change', applyFilters);
    }
    
    if (availabilityFilter) {
        availabilityFilter.addEventListener('change', applyFilters);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    
    // Сброс фильтров
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

// Применение фильтров
function applyFilters() {
    const genre = document.getElementById('genre-filter').value;
    const availability = document.getElementById('availability-filter').value;
    const sort = document.getElementById('sort-filter').value;
    
    let result = [...currentBooks];
    
    // Фильтрация по жанру
    if (genre) {
        result = result.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
    }
    
    // Фильтрация по доступности
    if (availability === 'available') {
        result = result.filter(book => book.available > 0);
    } else if (availability === 'borrowed') {
        result = result.filter(book => book.available === 0);
    }
    
    // Сортировка
    result.sort((a, b) => {
        switch (sort) {
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            case 'author-asc':
                return a.author.localeCompare(b.author);
            case 'author-desc':
                return b.author.localeCompare(a.author);
            case 'year-desc':
                return b.year - a.year;
            case 'year-asc':
                return a.year - b.year;
            default:
                return 0;
        }
    });
    
    filteredBooks = result;
    currentPage = 1;
    renderBooks();
    updateBooksCount();
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('genre-filter').value = '';
    document.getElementById('availability-filter').value = '';
    document.getElementById('sort-filter').value = 'title-asc';
    document.getElementById('search-input').value = '';
    
    filteredBooks = [...currentBooks];
    currentPage = 1;
    renderBooks();
    updateBooksCount();
}

// Инициализация пагинации
function initPagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', goToPrevPage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextPage);
    }
}

// Переход на предыдущую страницу
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderBooks();
    }
}

// Переход на следующую страницу
function goToNextPage() {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    
    if (currentPage < totalPages) {
        currentPage++;
        renderBooks();
    }
}

// Обновление пагинации
function updatePagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    
    if (!prevBtn || !nextBtn || !pageNumbers) return;
    
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    
    // Кнопки вперед/назад
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Номера страниц
    pageNumbers.innerHTML = '';
    
    // Всегда показываем первую страницу
    addPageButton(1);
    
    // Показываем многоточие, если нужно
    if (currentPage > 3) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.style.padding = '0 10px';
        ellipsis.style.color = '#6c757d';
        pageNumbers.appendChild(ellipsis);
    }
    
    // Показываем текущую и соседние страницы
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        addPageButton(i);
    }
    
    // Показываем многоточие, если нужно
    if (currentPage < totalPages - 2) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.style.padding = '0 10px';
        ellipsis.style.color = '#6c757d';
        pageNumbers.appendChild(ellipsis);
    }
    
    // Всегда показываем последнюю страницу (если она не первая)
    if (totalPages > 1) {
        addPageButton(totalPages);
    }
    
    // Функция добавления кнопки страницы
    function addPageButton(pageNum) {
        if (pageNum < 1 || pageNum > totalPages) return;
        
        const btn = document.createElement('button');
        btn.className = 'page-btn';
        btn.textContent = pageNum;
        
        if (pageNum === currentPage) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => {
            currentPage = pageNum;
            renderBooks();
        });
        
        pageNumbers.appendChild(btn);
    }
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
        window.location.href = 'index.html';
    }
}