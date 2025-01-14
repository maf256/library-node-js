const { Router } = require("express");
const {
  getAuthorById,
  getAuthors,
  addAuthor,
  updateAuthor,
  deleteAuthor,
} = require("./controller");
const { validateAuthor, authorSchema } = require("./validation");
const { authenticate } = require("../middleware");

const router = Router();

router.get("/",authenticate, getAuthors);
router.post("/",authenticate, validateAuthor(authorSchema), addAuthor);
router.put("/:id",authenticate, validateAuthor(authorSchema), updateAuthor);
router.get("/:id",authenticate, getAuthorById);
router.delete("/:id",authenticate, deleteAuthor);

module.exports = router;
