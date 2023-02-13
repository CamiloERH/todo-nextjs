import { FirebaseDB } from "../../../firebase/config";
import { collection, doc, getDocs, setDoc, getDoc, updateDoc, query, where, arrayUnion, arrayRemove } from "firebase/firestore/lite";

const handler = async (req, res) => {
    const todo = req.body;
    const { todoId } = req.query;

    if (req.method === 'POST') {
        const newDoc = doc(collection(FirebaseDB, `/todos`));
        const parentDocRef = doc(FirebaseDB, `todos/${todoId}`);

        const result = await setDoc(newDoc, {
            ...todo,
            isDeleted: false,
            isSubtask: true,
            status: "Programado",
            id: newDoc.id,
            subTasks: [],
            parent: parentDocRef
        });

        await updateDoc(parentDocRef, "subTasks", arrayUnion(newDoc));
        return res.status(200).send({ result });
    }

    if (req.method === 'PUT') {
        const docRef = doc(FirebaseDB, `todos/${todoId}`);

        await setDoc(docRef, {
            ...todo
        }, { merge: true });

        return res.status(200).send({ todo });
    }

    if (req.method === 'DELETE') {
        const docRef = doc(FirebaseDB, `todos/${todoId}`);
        const todo = await getDoc(docRef);

        if(todo.data().isSubtask){
            console.log(todo.data().parent.path);
            const parentRef = doc(FirebaseDB, todo.data().parent.path);
            await updateDoc(parentRef, "subTasks", arrayRemove(docRef))
            await updateDoc(docRef, "isDeleted", true); 
            return res.status(200).send({ msg: 'ok' })
        } 

        if (!!todo.data().subTasks){
            const promiseArray = todo.data().subTasks.map( async (subTask) => {
                let subTaskRef = doc(FirebaseDB, subTask.path);
                return await updateDoc(subTaskRef, "isDeleted", true); 
            });

            await updateDoc(docRef, "isDeleted", true);
            Promise.all(promiseArray);

            return res.status(200).send({ msg: 'ok' })
        }
    }
}

export default handler;