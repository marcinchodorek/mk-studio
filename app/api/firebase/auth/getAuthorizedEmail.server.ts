import { db } from "~/api/firebase/serverConfig.server";

const getAuthorizedEmail = async (email: string | undefined) => {
  try {
    const emailsRef = await db
      .collection("authorizedUsers")
      .where("email", "==", email)
      .get();

    return emailsRef.docs.map((doc) => doc.data());
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default getAuthorizedEmail;
