import { db } from "~/api/firebase/serverConfig.server";

const deleteContactById = async (id: string) => {
  try {
    const contactRef = await db
      .collection("contacts")
      .where("id", "==", id)
      .get();

    contactRef.docs.map((doc) => doc.ref.delete());
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default deleteContactById;
