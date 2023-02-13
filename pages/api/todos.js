import { FirebaseDB } from "@/firebase/config";
import { collection, doc, getDocs, setDoc, getDoc, query, where, QueryConstraint } from "firebase/firestore/lite";

const handler = async (req, res) => {
    const todo = req.body;

    if (req.method === 'POST') {
        const newDoc = doc(collection(FirebaseDB, `/todos`));
        
        await setDoc(newDoc, {
            ...todo,
            isDeleted: false,
            isSubtask: false,
            status: "Programado",
            id: newDoc.id,
            subTasks: [],
            parent: null,
        });
        return res.status(200).send({ ...todo, id: newDoc.id });
    }

    if (req.method === 'GET') {
        const collectionRef = collection(FirebaseDB, `todos`);
        let q = query(collectionRef, where("isDeleted", "==", false), where("isSubtask", "==", false));
        const docs = await getDocs(q);
        const docArray = [];

        docs.forEach(doc => {
            let { parent: _, ...data} = doc.data();
            console.log(data.attachments);
            docArray.push({
                ...data
            });
        });

        const promiseArray = docArray.map( async (doc) => {
            return ({
                ...doc,
                subTasks: !!doc.subTasks ? await Promise.all(doc.subTasks.map(async data => await getDoc(data))) : []
            });
        });

        const promiseRes = await Promise.all(promiseArray);
        const todos = promiseRes.map((doc) => ({
            ...doc,
            subTasks: doc.subTasks && doc.subTasks.map((snap) => snap.data())
        }));

        return res.status(200).send({ todos });
    }
}

export default handler;