import { FirebaseDB } from "../../../firebase/config";
import { collection, doc, getDocs, setDoc, getDoc, updateDoc, query, where } from "firebase/firestore/lite";

const handler = async (req, res) => {
    const todo = req.body;
    const { todoId } = req.query;
    if (req.method === 'PUT') {
        const docRef = doc(FirebaseDB, `todos/${todoId}`);
        let subTaskRef = null;
        if (todo.subTask) {
            subTaskRef = doc(FirebaseDB, todo.subTask);
        }
        await setDoc(docRef, {
            ...todo,
            subTask: subTaskRef
        }, { merge: true });
        return res.status(200).send({ todo });
    }

    if (req.method === 'DELETE') {
        const docRef = doc(FirebaseDB, `todos/${todoId}`);
        await getDoc(docRef);
        await updateDoc(docRef, "isDeleted", true);

        const collectionRef = collection(FirebaseDB, "todos");
        let q = query(collectionRef, where("subTask", "==", docRef));
        const docs = await getDocs(q)
        const todos = [];
        docs.forEach(async (doc) => {
            await updateDoc(doc.ref, { subTask: '' });
        });
        console.log(todos);
        return res.status(200).send({ msg: 'ok' })
    }

}

export default handler;