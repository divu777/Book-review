import e from "express";
import { authenticateToken } from "./../middleware/auth.js";
import { Book } from "../model/bookSchema.js";
import { User } from "../model/userSchema.js";

const router = e.Router();

//getting all book
router.get("/books", authenticateToken, async (req, res) => {
  console.log("herlllo");
  try {
    const books = await Book.find({});
    res.status(200).json({
      message: "Successfully books Retrived",
      books,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error in getting books",
    });
  }
});

//getting one book
router.get("/:bookId", authenticateToken, async (req, res) => {
  const { bookId } = req.params;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }
    res.status(200).json({
      message: "Successfully retrieved book",
      book,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error in getting book",
    });
  }
});

//adding book
router.post("/", authenticateToken, async (req, res) => {
  const { title, author, genre, description } = req.body;
  try {
    const newBook = new Book({
      title,
      author,
      genre,
      description,
    });
    await newBook.save();
    res.status(200).json({
      message: "Book added Succesfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error in Adding Book",
    });
  }
});

//adding Review
router.post("/:bookId/reviews", authenticateToken, async (req, res) => {
  const { bookId } = req.params;
  const { id } = req.user;
  const { rating, review } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({
        message: "Book not found",
      });
    }
    book.reviews.push({ userId: id, rating, review });
    await book.save();
    res.status(200).json({
      message: "Your Review was added",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error in adding Review",
    });
  }
});

export default router;
