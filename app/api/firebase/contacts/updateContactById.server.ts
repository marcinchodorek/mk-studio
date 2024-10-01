import { admin, db } from "~/api/firebase/serverConfig.server";
import { ContactRequestBody } from "~/api/firebase/contacts/types.server";

const updateContactById = async (
  id: string | undefined,
  contactBody: ContactRequestBody,
) => {
  try {
    const contactRef = await db
      .collection("contacts")
      .where("id", "==", id)
      .get();

    contactRef.docs.map(
      async (doc) =>
        await doc.ref.update({
          ...contactBody,
          updatedAt: admin.firestore.Timestamp.now(),
        }),
    );
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default updateContactById;
