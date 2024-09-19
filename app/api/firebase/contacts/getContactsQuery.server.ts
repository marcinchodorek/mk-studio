import { db } from "~/api/firebase/serverConfig.server";

const getContactsQuery = async () => {
  try {
    const contactsRef = await db.collection("contacts").get();
    return contactsRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default getContactsQuery;
