import { db } from "~/api/firebase/serverConfig.server";

const getContactById = async (id: string) => {
  try {
    const contactRef = await db
      .collection("contacts")
      .where("id", "==", id)
      .get();

    return contactRef.docs.map((doc) => doc.data());
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default getContactById;
