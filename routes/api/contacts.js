const express = require('express')
const Joi = require("joi");

const contactValidation = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
}); 

const updatedContactValid = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  email: Joi.string(),
});

const router = express.Router()

const { listContacts, getContactById, removeContact, addContact, updateContact, } = require('../../models/contacts');

router.get('/', async (req, res, next) => {
  try{
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (e){
    res.status(500).json({error: e.message})
  }
})

router.get('/:contactId', async (req, res, next) => {
  try{
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact){
        return res.status(404).json({message: 'not found'});
    }
    res.status(200).json(contact);
} catch (e) {
   res.status(500).json({error: e.message})
}
})

router.post('/', async (req, res, next) => {
  try{
    const {error} = contactValidation.validate(req.body);
    if(error){
      return  res.status(400).json({message: "missing required name field"});
    }
    const newContact = await addContact(req.body);
    res.status(201).json({newContact});
} catch (e) {
    res.status(500).json({error: e.message})
}
})

router.delete('/:contactId', async (req, res, next) => {
  try{
    const { contactId } = req.params;
   const contact = removeContact(contactId);
    if (!contact){
        return res.status(404).json({message: 'not found'});
    }
    res.status(200).json({message: 'contact deleted'});
} catch (e) {
    res.status(500).json({error: e.message})
}
})

router.put('/:contactId', async (req, res, next) => {
try{
  const {error, value } = updatedContactValid.validate(req.body);
  if (error || !Object.keys(value).length) {
    return res.status(400).json({message: 'missing fields'});
}
const { contactId } = req.params;
const updatedContact = await updateContact(contactId, req.body);
if(!updatedContact){
  return next();
}
res.status(200).json({updatedContact});
} catch (e) {
res.status(500).json({error: e.message})
}
})

module.exports = router