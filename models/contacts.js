const fs = require('fs/promises')
const path = require('path');
const { randomUUID } = require('crypto');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contactsList = JSON.parse(data);
  return contactsList;
}

const getContactById = async (contactId) => {
  const contactsList = await listContacts();
  const contact = contactsList.find(({id}) => id === contactId);
  if(!contact){
    return null;
  }
  return contact
}

const removeContact = async contactId => {
  const contactsList = await listContacts();
  const index = contactsList.findIndex(({id}) => id === contactId.toString());
  if(index === -1){
    return null;
  }
  const [removeContact] = contactsList.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contactsList));
  return removeContact;
}

const addContact = async (body) => {
  const contactList = await listContacts();
  const newContact = { id: randomUUID(), ...body };
  contactList.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactList));
  return newContact;
}

const updateContact = async (contactId, body) => {
  const contactList = await listContacts();
  const index = contactList.findIndex(({ id }) => id === contactId);
  if (index === -1) {
    return null;
  }
  contactList[index] = { ...contactList[index], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contactList));
  return contactList[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}