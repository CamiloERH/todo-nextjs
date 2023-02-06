import { FirebaseDB } from "@/firebase/config";
import { collection, doc, getDocs, setDoc, getDoc, query, where } from "firebase/firestore/lite";

const handler = async (req, res) => {
    const todo = req.body;

    if (req.method === 'POST') {
        const newDoc = doc(collection(FirebaseDB, `/todos`));
        let subTaskRef = null;
        if (todo.subTask) {
            subTaskRef = doc(FirebaseDB, todo.subTask);
        }
        await setDoc(newDoc, {
            ...todo,
            isDeleted: false,
            id: newDoc.id,
            subTask: subTaskRef
        });
        return res.status(200).send({ ...todo, id: newDoc.id });
    }

    if (req.method === 'GET') {
        const collectionRef = collection(FirebaseDB, `todos`);
        let q = query(collectionRef, where("isDeleted", "==", false))
        const docs = await getDocs(q);
        const docArray = [];

        docs.forEach(doc => {
            docArray.push({
                ...doc.data()
            });
        });
        
        const promiseArray = docArray.map(async (doc) => {
            return ({
                ...doc,
                subTask: !!doc.subTask ? await getDoc(doc.subTask) : null
            });
        });

        const promiseRes = await Promise.all(promiseArray);
        const todos = promiseRes.map((doc) => ({
            ...doc,
            subTask: doc.subTask && doc.subTask.data()
        }));

        return res.status(200).send({ todos });
    }
}

export default handler;