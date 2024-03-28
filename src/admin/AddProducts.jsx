import React ,{useState} from "react";
import {Container , Row ,Col, Form , FormGroup } from "reactstrap";
import {toast} from 'react-toastify';
import { db ,storage } from "../firebase.config";
import { ref , uploadBytesResumable , getDownloadURL } from "firebase/storage";
import { collection , addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {

    const [enterTitle ,setEnterTitle] = useState('')
    const [enterShortDescription ,setEnterShortDescription] = useState('')
    const [enterDescription ,setEnterDescription] = useState('')
    const [enterCategory ,setEnterCategory] = useState('')
    const [enterPrice ,setEnterPrice] = useState('')
    const [enterProductImg ,setEnterProductImg] = useState(null)
    const [loading , setLoading] = useState(false)
    const navigate = useNavigate();

    // const addProduct = async e =>{
    //     e.preventDefault()
    //     setLoading(true);
    //     // ====== add product to the firebase database ======
    //     try {
    //             const docRef = await collection(db ,'products');
    //             const storageRef = ref(storage, `productImages/${Date.now() + enterProductImg.name}`)
    //             const uploadTask = uploadBytesResumable(storageRef ,enterProductImg)
    //             uploadTask.on(()=>{
    //                 toast.error('images not uploaded!')
    //             }, ()=>{
    //                 getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL)=>{
    //                     await addDoc(docRef , {
    //                         productName : enterTitle,
    //                         shortDesc: enterShortDescription,
    //                         description : enterDescription,
    //                         category : enterCategory,
    //                         price : enterPrice,
    //                         imgUrl : downloadURL
    //                         }
    //                         )
    //                 })
    //             })
    //             setLoading(false);
    //             toast.success('product successfully added!');
    //             navigate('/dashboard/all-products');
    //     } catch (err){
    //         setLoading(false);
    //         toast.error('product not added!');
    //         console.log(err.message);
    //     }
    // }

    // ====== add product to the firebase database ======
    const addProduct = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const docRef = collection(db, 'products');
            const storageRef = ref(storage, `productImages/${Date.now() + enterProductImg.name}`);
            
            // تحميل الصورة إلى Firebase Storage باستخدام await
            const snapshot = await uploadBytesResumable(storageRef, enterProductImg);
            const downloadURL = await getDownloadURL(snapshot.ref);
    
            // إضافة البيانات إلى Firestore
            await addDoc(docRef, {
                productName: enterTitle,
                shortDesc: enterShortDescription,
                description: enterDescription,
                category: enterCategory,
                price: enterPrice,
                imgUrl: downloadURL
            });
    
            // تحديث حالة التحميل وعرض رسالة النجاح
            setLoading(false);
            toast.success('product successfully added!');
            navigate('/dashboard/all-products');
        } catch (err) {
            // تحديث حالة التحميل وعرض رسالة الخطأ
            setLoading(false);
            toast.error('product not added!');
            console.log(err.message);
        }
    }
    

    return ( 
    <section>
        <Container>
            <Row>
                <Col lg='12'>
                    {
                        loading ? ( 
                        <h4 className="py-5">Loading...</h4>
                        ) :( 
                        <>                    
                        <h4 className="mb-5">Add Product</h4>
                        <Form   onSubmit={addProduct}>
                            <FormGroup className="form__group">
                                <span>Product title</span>
                                <input type="text" placeholder="Double sofa" 
                                        value={enterTitle} 
                                        onChange={e => setEnterTitle(e.target.value)} 
                                        required
                                        />
                            </FormGroup>
                            <FormGroup className="form__group">
                                <span>Short Description</span>
                                <input type="text" placeholder="lorem........." 
                                        value={enterShortDescription} 
                                        onChange={e => setEnterShortDescription(e.target.value)} 
                                        required
                                        />
                            </FormGroup>
                            <FormGroup className="form__group">
                                <span>Description</span>
                                <input type="text" placeholder="Description......." 
                                        value={enterDescription} 
                                        onChange={e => setEnterDescription(e.target.value)} 
                                        required
                                        />
                            </FormGroup>
                            <div    className="d-flex algin-items-center justify-content-between gap-5">
                                <FormGroup className="form__group w-50 ">
                                    <span>Price</span>
                                    <input type="number" placeholder="$100" 
                                            value={enterPrice} 
                                            onChange={e => setEnterPrice(e.target.value)} 
                                            required
                                            />
                                </FormGroup>
                                <FormGroup className="form__group w-50">
                                    <span>Category</span>
                                    <select className="w-100 p-2" 
                                            value={enterCategory} 
                                            onChange={e => setEnterCategory(e.target.value)} 
                                            required
                                            >
                                        <option >Select category</option>
                                        <option value="chair">Chair</option>
                                        <option value="sofa">Sofa</option>
                                        <option value="mobile">Bed</option>
                                        <option value="watch">Cupboards</option>
                                        <option value="wireless">Antica</option>
                                    </select>
                                </FormGroup>
                            </div>
                            <div>
                                <FormGroup className="form__group">
                                    <span>Product Image</span>
                                    <input type="file" 
                                            onChange={(e)=> setEnterProductImg(e.target.files[0])} 
                                            required 
                                            />
                                </FormGroup>
                            </div>
                            <button className="bay__btn ">Add Product</button>
                        </Form>
                        </>
                        )
                    }
                </Col>
            </Row>
        </Container>
    </section>
    )
}

export default AddProducts;