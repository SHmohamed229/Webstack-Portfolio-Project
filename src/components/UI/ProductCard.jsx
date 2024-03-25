import React from "react";
import { motion } from "framer-motion";
import '../../styles/product-card.css'
import { Col } from "reactstrap";
import { Link } from "react-router-dom";

import {  toast } from 'react-toastify';

import { useDispatch } from "react-redux";
import { cartAction } from "../../redux/slices/cartSlice";

const ProductCard = ({item}) => {
    const dispatch = useDispatch();
    const addToCart = () => {
        dispatch(cartAction.addItem({
            id: item.id,
            productName: item.productName,
            price: item.price,
            image: item.imgUrl,
        }))
        // toast.success('تم اضافة المنتج الى السلة بنجاح');
        toast.success('Product added Successfully');
    }
    return (
        <Col  lg='3' md='4' className="mb-2">
            <div className="product__item">
                <motion.div whileHover={{scale:0.9}} className="product__img">
                    <img src={item.imgUrl} alt="productImg" />
                </motion.div>
                <div  className="p-2 product__info">
                        <h3 className="product__name"><Link to={`/shop/${item.id}`}>{item.productName}</Link></h3>
                        <span >{item.category}</span>
                </div>
                <div className="product__card-bottom d-flex align-items-center
                    justify-content-between p-2">
                        <span className="price">${item.price}</span>
                        <motion.span  whileTap={{scale:1.2}}    onClick={addToCart}><i class='ri-add-line'></i></motion.span>
                </div>
            </div>
        </Col>
    )
}

export default ProductCard;