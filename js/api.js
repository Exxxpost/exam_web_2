// API для взаимодействия с бэкендом

const API_BASE_URL = 'http://localhost:3000/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Ошибка: ${response.status}`);
  }
  return response.json();
}

async function getBooks(page = 1, limit = 10, filters = {}) {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    
    const response = await fetch(`${API_BASE_URL}/books?${queryParams}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Ошибка получения книг:', error);
    throw error;
  }
}

async function getBook(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Ошибка получения книги:', error);
    throw error;
  }
}

async function createBook(bookData) {
  try {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Ошибка создания книги:', error);
    throw error;
  }
}

async function updateBook(id, bookData) {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Ошибка обновления книги:', error);
    throw error;
  }
}

async function deleteBook(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Ошибка удаления книги:', error);
    throw error;
  }
}

// Читатели
async function getReaders() {
  try {
    const response = await fetch(`${API_BASE_URL}/readers`);
    return handleResponse(response);
  } catch (error) {
    console.error('Ошибка получения читателей:', error);
    throw error;
  }
}

// Выданные книги
async function getBorrowedBooks() {
  try {
    const response = await fetch(`${API_BASE_URL}/borrowed-books`);
    return handleResponse(response);
  } catch (error) {
    console.error('Ошибка получения выданных книг:', error);
    throw error;
  }
}

// Статистика
async function getStatistics() {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics`);
    return handleResponse(response);
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    throw error;
  }
}

// Аутентификация
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Ошибка входа:', error);
    throw error;
  }
}

async function register(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw error;
  }
}

async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check`);
    return handleResponse(response);
  } catch (error) {
    console.error('Ошибка проверки аутентификации:', error);
    throw error;
  }
}

// Экспорт функций
window.LibraryAPI = {
  // Книги
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  
  // Читатели
  getReaders,
  
  // Выданные книги
  getBorrowedBooks,
  
  // Статистика
  getStatistics,
  
  // Аутентификация
  login,
  register,
  checkAuth,
  
  // Вспомогательные
  isAuthenticated: () => localStorage.getItem('isAuthenticated') === 'true',
  getCurrentUser: () => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      return {
        email: localStorage.getItem('userEmail'),
        role: localStorage.getItem('userRole'),
        full_name: localStorage.getItem('userName')
      };
    }
    return null;
  }
};