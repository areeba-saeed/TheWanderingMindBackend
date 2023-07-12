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
    const trimmedName = name.trimRight();
    const urlName = `${trimmedName
      .replace(/\s+$/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    const newAuthor = new Authors({
      name,
      urlName,
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
  const trimmedName = name.trimRight();
  const urlName = `${trimmedName
    .replace(/\s+$/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  await Authors.findByIdAndUpdate(
    id,
    { name: name, urlName: urlName },
    { new: true }
  )
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
