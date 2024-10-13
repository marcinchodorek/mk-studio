import { db } from '~/api/firebase/serverConfig.server';
import getGroupedContactsById from '~/helpers/get-grouped-contacts-by-id';

import { Contact, GroupedContactsById } from './types.server';
import { FirebaseError } from 'firebase/app';

type ContactsQuery = {
  contacts: Contact[];
  contactsById: GroupedContactsById;
};

const getContactsQuery = async (): Promise<ContactsQuery> => {
  try {
    const contactsRef = await db.collection('contacts').get();
    const contacts = contactsRef.docs.map((doc) => doc.data()) as Contact[];
    return { contacts, contactsById: getGroupedContactsById(contacts) };
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    } else {
      throw new Error('Error while fetching contacts');
    }
  }
};

export default getContactsQuery;
