import React , {useState , useRef,useEffect} from "react";
import { Container , Row , Col } from "reactstrap";
import { useParams } from "react-router-dom";
import products from "../assets/data/products";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { motion } from "framer-motion";
import '../styles/product-details.css'
import ProductsList from "../components/UI/ProductsList";
import { useDispatch } from "react-redux";
import { cartAction } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";

import { db } from "../firebase.config";
import { doc , getDoc } from "firebase/firestore";
import useGetData from "../custom-hooks/useGetData";

const ProductDetails = () => {
    const [product,setProducts] = useState({});
    const [tap,setTap] = useState('desc');
    const reviewUSer = useRef('');
    const reviewMsg = useRef('');
    const dispatch = useDispatch();

    const [rating,setRating] = useState(null);
    const {id} = useParams();
    const {data:products} = useGetData('products');
    // const product = products.find(item => item.id ===id);
    const docRef = doc(db,'products',id);
    useEffect(()=>{
        const getProduct = async () =>{
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setProducts(docSnap.data());
            } else {
                console.log('no such product!');
            }
        }
        getProduct();
    },[]);

    const { 
            imgUrl ,
            productName  , 
            price , 
            // avgRating, 
            // reviews , 
            description ,
            shortDesc , 
            category
        } = product;

    const relatedProducts = products.filter(item => item.category === product.category && item.id !== id);

    const submitHandler = (e) =>{
        e.preventDefault();
        const reviewUserName = reviewUSer.current.value;
        const reviewUserMsg = reviewMsg.current.value;
        console.log(reviewUserName,reviewUserMsg,rating);
        const reviewObj = {
            userName:reviewUserName,
            text:reviewUserMsg,
            rating
        };
        console.log("reviewObj",reviewObj);
        toast.success('Review Submitted!!');
    };

    const addToCart = () =>{
        dispatch(cartAction.addItem({
            id,
            image:imgUrl,
            productName,
            price,
        })
        );
        toast.success('Product added Successfully');
    }

    useEffect(()=>{
        window.scrollTo(0,0);
    },[product])
    return (
        <Helmet title={productName}>
            <CommonSection title={productName} />

            <section className="p-0">
                <Container>
                    <Row>
                        <Col lg='6'>
                            <img src={imgUrl} alt="" />
                        </Col>

                        <Col lg='6'>
                            <div className="product__details">
                                <h2>{productName}</h2>
                                <div className="product__rating d-flex algin-item-center gap-4 mb-3">
                                    <div>
                                        <span><i class='ri-star-s-fill'></i></span>
                                        <span><i class='ri-star-s-fill'></i></span>
                                        <span><i class='ri-star-s-fill'></i></span>
                                        <span><i class='ri-star-s-fill'></i></span>
                                        <span><i class='ri-star-half-s-fill'></i></span>
                                    </div>
                                    {/* <p>(<span>{avgRating}</span> ratings)</p> */}
                                </div>
                                <div className="d-flex algin-items-center gap-4">
                                    <span className="product__price">${price}</span>
                                    <span>Category : {category?.toUpperCase()}</span>
                                </div>
                                <p className="mt-3">{shortDesc}</p>
                                <motion.button whileTap={{ scale: 1.2 }} className="bay__btn" onClick={addToCart}>
                                    Add to Cart
                                </motion.button>
                                
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section>
                <Container>
                    <Row>
                        <Col lg='12'>
                            <div className="tap__wrapper d-flex align-items-center gap-5">
                                <h6 className={`${tap === 'desc' ? 'active__tap' : ""}`} onClick={() => setTap('desc')}>Description</h6>
                                <h6 className={`${tap === 'rev' ? 'active__tap' : ""}`} onClick={() => setTap('rev')}>Reviews 
                                {/* ({reviews.length}) */}
                                </h6>
                            </div>
                            {
                                tap === 'desc' ? <div className="tap__content mt-4">
                                <p>{description}</p>
                                </div>  : <div  className="product__review mt-4">
                                    <div className="review__wrapper">
                                        {/* <ul>
                                            {
                                                reviews?.map((item,index) => (
                                                    <li key={index} className="mb-4">
                                                        <h6> {item.userName}</h6>
                                                        <span>{item.rating} (rating)</span>
                                                        <p>{item.text}</p>
                                                    </li>
                                                ))
                                            }
                                        </ul> */}
                                        <div className="review__form">
                                            <h4>Leave your experience</h4>
                                            <form action="" onSubmit={submitHandler}>
                                                <div className="form__group">
                                                    <input type="text" placeholder="Enter Name" required  ref={reviewUSer}/>
                                                </div>
                                                <div className="form__group d-flex algin-items-center gap-4">
                                                    <motion.span whileTap={{scale:1.2}} onClick={() => setRating(1)}>1<i class='ri-star-s-fill'></i></motion.span>
                                                    <motion.span whileTap={{scale:1.2}} onClick={() => setRating(2)}>2<i class='ri-star-s-fill'></i></motion.span>
                                                    <motion.span whileTap={{scale:1.2}} onClick={() => setRating(3)}>3<i class='ri-star-s-fill'></i></motion.span>
                                                    <motion.span whileTap={{scale:1.2}} onClick={() => setRating(4)}>4<i class='ri-star-s-fill'></i></motion.span>
                                                    <motion.span whileTap={{scale:1.2}} onClick={() => setRating(5)}>5<i class='ri-star-s-fill'></i></motion.span>
                                                </div>
                                                <div className="form__group">
                                                    <textarea 
                                                        ref={reviewMsg}
                                                        rows={4}
                                                        type="text" 
                                                        placeholder="Review Message...." 
                                                        required
                                                        />
                                                </div>
                                                <motion.button whileTap={{scale:1.2}} type="submit" className="bay__btn">Send</motion.button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            }
                            
                        </Col>
                        <Col lg='12' className="mt-5">
                            <h2 className="related__title">You Might also Like</h2>
                        </Col>
                        <ProductsList data={relatedProducts} />
                    </Row>
                </Container>
            </section>
        </Helmet>
    )
}

export default ProductDetails;