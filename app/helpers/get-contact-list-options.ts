import { Contact } from '~/api/firebase/contacts/types.server';

export default function getContactListOptions(contacts: Contact[]) {
  return contacts.map((contact) => ({
    label: contact.fullName,
    value: contact.id,
  }));
}
