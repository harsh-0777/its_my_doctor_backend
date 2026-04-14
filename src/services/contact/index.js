import { Contact } from "../../models/index.js";
import { ApiError } from "../../utils/index.js";
import { CONTACT_MESSAGES } from "../../constants/index.js";

export const submitContact = async (body) => {
  const { name, email, subject, message } = body;
  const contact = await Contact.create({ name, email, subject, message });
  return contact;
};

export const getAllContacts = async (query = {}) => {
  const { page = 1, limit = 20, status } = query;
  const filter = {};
  if (status) filter.status = status;

  const [contacts, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Contact.countDocuments(filter),
  ]);

  return { contacts, total, page: Number(page), limit: Number(limit) };
};

export const updateContactStatus = async (id, status) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (!contact) throw ApiError.notFound(CONTACT_MESSAGES.NOT_FOUND);
  return contact;
};
