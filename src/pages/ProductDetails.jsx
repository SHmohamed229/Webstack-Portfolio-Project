import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { motion } from "framer-motion";
import '../styles/product-details.css';
import ProductsList from "../components/UI/ProductsList";
import { useDispatch } from "react-redux";
import { cartAction } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import { doc, getDoc, addDoc ,collection} from "firebase/firestore";
import useGetData from "../custom-hooks/useGetData";

const ProductDetails = () => {
    const [product, setProduct] = useState({});
    const [tap, setTap] = useState('desc');
    const reviewUSer = useRef('');
    const reviewMsg = useRef('');
    const dispatch = useDispatch();

    const [rating, setRating] = useState(null);
    const { id } = useParams();
    const { data: products } = useGetData('products');
    const { data: reviews, loading } = useGetData('reviews'); // جلب بيانات المراجعات
    const docRef = doc(db, 'products', id);

    useEffect(() => {
        const getProduct = async () => {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProduct(docSnap.data());
            } else {
                console.log('No such product!');
            }
        }
        getProduct();
    }, []);

    const { 
        imgUrl,
        productName,
        price,
        description,
        shortDesc,
        category
    } = product;

    const relatedProducts = products.filter(item => item.category === product.category && item.id !== id);

    const submitHandler = async (e) => {
        e.preventDefault();
        const reviewUserName = reviewUSer.current.value;
        const reviewUserMsg = reviewMsg.current.value;

        // التحقق من أن تم تحديد التقييم
        if (!rating) {
            toast.error('Please select a rating before submitting the review.');
            return;
        }

        const reviewObj = {
            userName: reviewUserName,
            text: reviewUserMsg,
            rating
        };

        try {
            // إرسال بيانات المراجعة إلى Firebase
            await addDoc(collection(db, 'reviews'), reviewObj);
            toast.success('Review Submitted!');
            // تفريغ حقول المراجعة بعد الإرسال
            reviewUSer.current.value = '';
            reviewMsg.current.value = '';
            setRating(null);
        } catch (error) {
            console.error('Error submitting review: ', error);
            toast.error('Failed to submit review. Please try again.');
        }
    };

    const addToCart = () => {
        dispatch(cartAction.addItem({
            id,
            image: imgUrl,
            productName,
            price,
        }));
        toast.success('Product added Successfully');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [product]);

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
                                <div className="d-flex align-items-center gap-4">
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
                                <h6 className={`${tap === 'rev' ? 'active__tap' : ""}`} onClick={() => setTap('rev')}>Reviews</h6>
                            </div>
                            {tap === 'desc' ? 
                                <div className="tap__content mt-4">
                                    <p>{description}</p>
                                </div> 
                                : 
                                <div  className="product__review mt-5">
                                    <div className="review__wrapper">
                                    <div className="review__list">

                                            {loading ? <p>Loading...</p> : (
                                                <ul>
                                                    {
                                                    reviews.map((review, index) => (
                                                        <li key={index} className="mb-4">
                                                            <h6>{review.userName}</h6>
                                                            <span>
                                                                {[...Array(review.rating)].map((_, i) => (
                                                                    <i key={i} className='ri-star-fill'></i>
                                                                ))} (rating)
                                                            </span> 
                                                            <p>{review.text}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div className="review__form">
                                            <h4>Leave your experience</h4>
                                            <form action="" onSubmit={submitHandler}>
                                                <div className="form__group">
                                                    <input type="text" placeholder="Enter Name" required  ref={reviewUSer}/>
                                                </div>
                                                <div className="form__group d-flex align-items-center gap-4">
                                                    <motion.span whileTap={{scale:1.2}} onClick={() => setRating(1)}>1<i className='ri-star-s-fill'></i></motion.span>
                                                    <motion.span whileTap={{scale:1.2}} onClick={() => setRating(2)}>2<i className='ri-star-s-fill'></i></motion.span>
                                                    <motion.span whileTap={{scale:1.2}} onClick={() => setRating(3)}>3<i className='ri-star-s-fill'></i></motion.span>
                                                    <motion.span whileTap={{scale:1.2}} onClick={() => setRating(4)}>4<i className='ri-star-s-fill'></i></motion.span>
                                                    <motion.span whileTap={{scale:1.2}} onClick={() => setRating(5)}>5<i className='ri-star-s-fill'></i></motion.span>
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
    );
};

export default ProductDetails;
