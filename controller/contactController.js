const Contact = require("../models/contactModel");

const getContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
};

const postContact = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newContact = new Contact({
      name,
      email,
      message,
      status: "Pending",
    });
    newContact.save();
    res.json(newContact);
  } catch (error) {
    res.send("Error sending message");
  }
};
const updateContact = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    res.json(updatedContact);
  } catch (error) {
    res.send("Error sending message");
  }
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  await Contact.findByIdAndDelete(id)
    .then((contact) => {
      res.json(contact);
    })
    .catch((error) => {
      res.send("Error deleting message");
    });
};

module.exports = { getContacts, postContact, updateContact, deleteContact };
