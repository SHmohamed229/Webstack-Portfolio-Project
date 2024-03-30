
import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import Helmet from '../components/Helmet/Helmet';
import CommonSection from '../components/UI/CommonSection';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { db } from "../firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import '../styles/checkout.css';

const Checkout = () => {
    const totalQty = useSelector(state => state.cart.totalQuantity);
    const totalAmount = useSelector(state => state.cart.totalAmount);
    const productName = useSelector(state => state.cart.productName);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        streetAddress: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        // التحقق من اكتمال بيانات الفورم
    const formFilled = Object.values(formData).every(value => value !== '');
    if (!formFilled || totalQty === 0 || totalAmount === 0) {
        // إذا لم تكن بيانات الفورم مكتملة، عرض رسالة تنبيه
        toast.error('Please fill in all the fields before placing the order.');
        return; // إيقاف تنفيذ الدالة إذا لم تكن بيانات الفورم مكتملة
    }

        try {
            // توسيع بيانات الفورم لتضمين تفاصيل الطلب أيضًا
            const orderData = {
                ...formData,
                
                    items: Array.isArray(productName) ? [...productName] : [], 
                 // قائمة بالمشتريات التي اختارها المستخدم، يمكن ملء هذا الجزء بناءً على بيانات السلة في Redux
                totalQuantity: totalQty,
                totalAmount: totalAmount
            };
            
            // إرسال بيانات النموذج إلى Firebase
            const docRef = await addDoc(collection(db, 'orders'), orderData);

            // تفريغ النموذج
            setFormData({
                name: '',
                email: '',
                phoneNumber: '',
                streetAddress: '',
                city: '',
                postalCode: '',
                country: ''
            });

            // window.location.reload();
                        // إظهار رسالة تأكيد مع رقم الطلب
                        toast.success(`Order placed successfully. Order ID: ${docRef.id}`);
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
        } catch (error) {
            console.error('Error adding document: ', error);
            toast.error('Failed to place order. Please try again.');
        }
    };

    return (
        <Helmet title="Checkout">
            <CommonSection title="Checkout" />
            <section>
                <Container>
                    <Row>
                        <Col lg='8'>
                            <h6 className="mb-4 fw-bold">Billing Information</h6>
                            <Form className="billing__form" onSubmit={handleSubmit}>
                                <FormGroup className="form__group">
                                    <input type="text" placeholder="Enter Your Name" name="name" value={formData.name} onChange={handleInputChange} required/>
                                </FormGroup>
                                <FormGroup className="form__group">
                                    <input type="email" placeholder="Enter Your Email" name="email" value={formData.email} onChange={handleInputChange} required/>
                                </FormGroup>
                                <FormGroup className="form__group">
                                    <input type="text" placeholder="Phone number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required/>
                                </FormGroup>
                                <FormGroup className="form__group">
                                    <input type="text" placeholder="Street address" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} required/>
                                </FormGroup>
                                <FormGroup className="form__group">
                                    <input type="text" placeholder="City" name="city" value={formData.city} onChange={handleInputChange} required/>
                                </FormGroup>
                                <FormGroup className="form__group">
                                    <input type="text" placeholder="Postal code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required/>
                                </FormGroup>
                                <FormGroup className="form__group">
                                    <input type="text" placeholder="Country" name="country" value={formData.country} onChange={handleInputChange} required/>
                                </FormGroup>
                            </Form>
                        </Col>

                        <Col lg='4'>
                            <div className="checkout__cart">
                                <h6>Total Qty : <span>{totalQty} items</span></h6>
                                <h6>Subtotal : <span>${totalAmount}</span></h6>
                                <h6><span>Shipping : <br />Free Shipping </span> <span>$0</span></h6>
                                <h4>Total Cost : <span>${totalAmount}</span></h4>
                                <button onClick={handleSubmit} className="bay__btn auth__btn w-100">Place an order</button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
}

export default Checkout;
