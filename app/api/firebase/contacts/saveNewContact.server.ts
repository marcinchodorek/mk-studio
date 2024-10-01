import { v4 as guid } from "uuid";

import { admin, db } from "~/api/firebase/serverConfig.server";
import { ContactRequestBody } from "~/api/firebase/contacts/types.server";

const saveNewContact = async (contactBody: ContactRequestBody) => {
  try {
    await db.collection("contacts").add({
      ...contactBody,
      createdAt: admin.firestore.Timestamp.now(),
      id: guid(),
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default saveNewContact;
