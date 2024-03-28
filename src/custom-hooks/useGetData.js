import {useState ,useEffect} from "react";
import {db} from "../firebase.config";
import { collection , onSnapshot } from "firebase/firestore";

const useGetData = (url) => {
    const [data, setData] = useState([]);
    const collectionRef = collection(db, url);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            // ======= Firebase FireStore Realtime data Update =======
            await onSnapshot(collectionRef ,(snapshot)=>{
                setData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
                setLoading(false);
            });
        };
        getData();
        // fetch(url)
        //     .then((response) => response.json())
        //     .then((data) => {
        //         setData(data);
        //         setLoading(false);
        //     });
    }, []);

    return { data, loading };
};

export default useGetData;