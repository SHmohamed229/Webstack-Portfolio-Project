import React from "react";
import { Container, Row, Col,Table } from "reactstrap";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import useGetData from "../custom-hooks/useGetData";
import { toast } from 'react-toastify';

const Orders = () => {
    const { data: usersData, loading } = useGetData("orders");

    const deleteOrder = async (id) => {
        await deleteDoc(doc(db, "orders", id));
        toast.success(`Order Deleted!`);
    }

    return (
        <Container>
            <Row>
            <Col lg='12'>
                    <h4 className="pt-5 fw-bold">Orders</h4>
                </Col>
                <Col lg='12' className="pt-5">
                {loading ? (
                <p>Loading...</p>
            ) : (
                <Table className="table"  responsive>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Sr Address</th>
                            <th>City</th>
                            <th>Postal Code</th>
                            <th>Country</th>
                            <th>Total Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.name}</td>
                                <td>{order.email}</td>
                                <td>{order.phoneNumber}</td>
                                <td>{order.streetAddress}</td>
                                <td>{order.city}</td>
                                <td>{order.postalCode}</td>
                                <td>{order.country}</td>
                                <td>{order.totalAmount}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => deleteOrder(order.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
                </Col>
            </Row>
        </Container>
    )
}

export default Orders;
