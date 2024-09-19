import { admin, db } from "~/api/firebase/serverConfig.server";

type Contact = {
  name: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
};

const saveNewContact = async (contactBody: Contact) => {
  try {
    await db.collection("contacts").add({
      ...contactBody,
      createdAt: admin.firestore.Timestamp.now(),
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default saveNewContact;
