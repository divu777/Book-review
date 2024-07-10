import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAddBookForm, setShowAddBookForm] = useState<boolean>(false);
  const [isAddingBook, setIsAddingBook] = useState<boolean>(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/book/books`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBooks(response.data.books);
        setFilteredBooks(response.data.books);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterBooks(term);
  };

  const filterBooks = (term: string) => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleAddBookClick = () => {
    setShowAddBookForm(true);
  };

  const handleCloseAddBookForm = () => {
    setShowAddBookForm(false);
    setNewBook({ title: "", author: "", genre: "", description: "" });
  };

  const handleNewBookChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  const handleAddBook = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsAddingBook(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/book`,
        newBook,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const booksResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/book/books`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBooks(booksResponse.data.books);
        setFilteredBooks(booksResponse.data.books);
        handleCloseAddBookForm();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error adding new book:", error.message);
        console.error("Error details:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsAddingBook(false);
    }
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white shadow">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, {username}
          </h1>
        </div>
      </div>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
            <button
              onClick={handleAddBookClick}
              className="ml-4 px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Add Book
            </button>
          </div>

          {showAddBookForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-96">
                <div className="flex justify-end">
                  <button
                    onClick={handleCloseAddBookForm}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <svg
                      className="w-6 h-6 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 10.586l4.293-4.293a1 1 0 1 1 1.414 1.414L13.414 12l4.293 4.293a1 1 0 0 1-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 1 1-1.414-1.414L10.586 12 6.293 7.707a1 1 0 1 1 1.414-1.414L12 10.586z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
                <form onSubmit={handleAddBook}>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="title"
                      value={newBook.title}
                      onChange={handleNewBookChange}
                      placeholder="Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="author"
                      value={newBook.author}
                      onChange={handleNewBookChange}
                      placeholder="Author"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="genre"
                      value={newBook.genre}
                      onChange={handleNewBookChange}
                      placeholder="Genre"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      name="description"
                      value={newBook.description}
                      onChange={handleNewBookChange}
                      placeholder="Description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isAddingBook}
                    >
                      {isAddingBook ? "Adding..." : "Add Book"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {!filteredBooks || filteredBooks.length === 0 ? (
            <p className="text-center text-xl text-gray-600 mt-8">
              No books found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="bg-white overflow-hidden shadow-lg rounded-xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  onClick={() => handleBookClick(book._id)}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {book.title}
                    </h3>
                    <p className="text-md text-gray-600 mb-2">
                      by {book.author}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">{book.genre}</p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {book.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
