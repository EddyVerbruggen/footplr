import { firestore } from "nativescript-plugin-firebase";
import Club from "~/models/club";
import DocumentReference = firestore.DocumentReference;

export async function getClub(teamRef: firestore.DocumentReference): Promise<Club> {
  if (!teamRef) {
    return null;
  }
  // get a reference to the document of the club this team belongs to
  const clubRef: DocumentReference = teamRef.parent.parent;
  const clubDoc = await clubRef.get();
  return <Club>clubDoc.data();
}
