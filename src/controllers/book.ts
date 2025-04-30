import { NextFunction, Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import Book from "../models/Book";

const bookController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, caption, image, rating } = req.body;
      if (!title || !caption || !image || !rating) {
        return res.status(400).json({ message: "All fields are required" });
      }
      let uploadResponse: any;
      try {
        uploadResponse = await cloudinary.uploader.upload(image);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Image upload failed" });
      }
      const imageUrl = uploadResponse.secure_url;
      const newBook = await Book.create({
        title,
        caption,
        image: imageUrl,
        rating,
        user: (req as any).user._id,
      });
      return res.status(201).json({
        newBook,
      });
    } catch (error) {
      return res.status(500).json({ message: "Book creation failed" + error });
    }
  },
  async getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.skip || 1;
      const limit = req.query.limit || 5;
      const skip = (Number(page) - 1) * Number(limit);

      const books = await Book.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("user", "username profileImage");
      const totalBooks = await Book.countDocuments();
      return res.status(200).json({
        currentPage: Number(page),
        totalBooks,
        totalPages: Math.ceil(totalBooks / Number(limit)),
        books,
      });
    } catch (error) {
      return res.status(500).json({ message: "Book fetch failed" });
    }
  },
  async deleteBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      if (book.user.toString() !== (req as any).user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (book.image && book.image.includes("cloudinary")) {
        try {
          const imageId = book.image.split("/").pop()?.split(".")[0];
          await cloudinary.uploader.destroy(imageId as string);
        } catch (error) {
          return res.status(500).json({ message: "Image deletion failed" });
        }
      }
      await book.deleteOne();
      return res.status(200).json({
        message: "Book deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: "Book deletion failed" });
    }
  },
};

export default bookController;
