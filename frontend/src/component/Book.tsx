import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";

interface Review {
  _id: string;
  userId: string;
  rating: number;
  review: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  reviews: Review[];
}

const Book: React.FC = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newReview, setNewReview] = useState({ rating: 0, review: "" });
  const [showAddReviewForm, setShowAddReviewForm] = useState<boolean>(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { bookId } = useParams<{ bookId: string }>();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/book/${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBook(response.data.book);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book:", error);
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/book/${bookId}/reviews`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refetch the book to get updated reviews
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBook(response.data.book);
      setNewReview({ rating: 0, review: "" });
      setShowAddReviewForm(false);
      setError(null);
    } catch (error) {
      console.error("Error adding review:", error);
      setError("Failed to add review. Please try again later.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShowAddReviewForm = () => {
    setShowAddReviewForm(true);
    setError(null); // Clear any previous errors when showing the form
  };

  const handleCloseAddReviewForm = () => {
    setShowAddReviewForm(false);
    setNewReview({ rating: 0, review: "" });
    setError(null); // Clear any errors when closing the form
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (!book) {
    return <p className="text-center text-gray-600">Book not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {book.title}
          </h1>
          <p className="text-xl text-gray-600 mb-2">by {book.author}</p>
          <p className="text-md text-gray-500 mb-4">{book.genre}</p>
          <p className="text-gray-700 mb-6">{book.description}</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
          {book.reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            <ul className="space-y-4">
              {book.reviews.map((review) => (
                <li key={review._id} className="border-b pb-4">
                  <p className="text-yellow-500 mb-1">
                    Rating: {review.rating}/5
                  </p>
                  <p className="text-gray-700">{review.review}</p>
                </li>
              ))}
            </ul>
          )}

          {!showAddReviewForm && (
            <button
              onClick={handleShowAddReviewForm}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Review
            </button>
          )}

          {showAddReviewForm && (
            <form onSubmit={handleAddReview} className="mt-6">
              <div className="mb-4">
                <label
                  htmlFor="rating"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  id="rating"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="review"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Review
                </label>
                <textarea
                  id="review"
                  value={newReview.review}
                  onChange={(e) =>
                    setNewReview({ ...newReview, review: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                  required
                ></textarea>
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isSubmittingReview}
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseAddReviewForm}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;
