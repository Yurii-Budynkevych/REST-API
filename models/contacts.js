const mongoose = require('mongoose');

const contactsSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});
const ContactsModel = mongoose.model('contacts', contactsSchema);
module.exports = { ContactsModel };
