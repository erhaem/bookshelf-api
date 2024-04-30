const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = async (request, h) => {
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    publisher,
    summary,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  /** check if book successfully added */
  const isSuccess = books.some((book) => book.id === id);
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = books;

  /** 0 = false, true = 1 */
  const ALLOWED_BOOLEAN_VALUE = ['0', '1'];

  /** Filter by name */
  if (name !== undefined) {
    const filterName = name.trim().toLowerCase();
    filteredBooks = filteredBooks.filter((book) => book
      .name.toLowerCase().includes(filterName));
  }

  /** Filter on reading books */
  if (reading !== undefined && ALLOWED_BOOLEAN_VALUE
    .includes(reading)) {
    filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
  }

  /** Filter finished (already read) books */
  if (finished !== undefined && ALLOWED_BOOLEAN_VALUE
    .includes(finished)) {
    filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
  }

  const formattedBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: formattedBooks,
    },
  }).code(200);
};

const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((buku) => buku.id === bookId);

  if (book) {
    return h.response({
      status: 'success',
      data: { book },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const editBookById = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const bookIndex = books.findIndex((buku) => buku.id === bookId);

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const bookIndex = books.findIndex((buku) => buku.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);

    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
