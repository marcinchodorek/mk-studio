import {
  Contact,
  GroupedContactsById,
} from '~/api/firebase/contacts/types.server';

export default function getGroupedContactsById(contacts: Contact[]) {
  return contacts.reduce(
    (acc, contact) => ({ ...acc, [contact.id]: contact }),
    {} as GroupedContactsById
  );
}
