const Authors = require("../models/authorModel");

const getAuthors = async (req, res) => {
  const authors = await Authors.find();
  res.json(authors);
};

const setAuthor = async (req, res) => {
  const { name } = req.body;

  try {
    const existingAuthor = await Authors.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingAuthor) {
      return res.status(404).send("Author already exists");
    }

    const newAuthor = new Authors({
      name,
    });
    newAuthor.save();
    res.json(newAuthor);
  } catch (error) {
    res.json(error);
  }
};
const updateAuthor = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await Authors.findByIdAndUpdate(id, { name: name }, { new: true })
    .then((author) => {
      res.json(author);
    })
    .catch((error) => {
      res.json(error);
    });
};
const deleteAuthor = async (req, res) => {
  const { id } = req.params;

  try {
    const author = await Authors.findByIdAndDelete(id);
    res.json(author);
  } catch (error) {
    res.json(error);
  }
};

module.exports = { getAuthors, setAuthor, updateAuthor, deleteAuthor };
