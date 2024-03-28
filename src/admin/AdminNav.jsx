import React , {useRef,useEffect} from "react";
import { Container , Row  } from "reactstrap";
import '../styles/admin-nav.css';
import userIcon from '../assets/images/user-icon.png'

import {motion} from 'framer-motion'


import useAuth from "../custom-hooks/useAuth";
import { Link, NavLink ,useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {auth} from '../firebase.config'
import {toast} from 'react-toastify';


const admin__nav = [
    {
        display: 'Dashboard',
        path: '/dashboard'
    },
    {
        display: 'Add-Product',
        path: '/dashboard/add-products'
    },
    {
        display: 'All-Products',
        path: '/dashboard/all-products'
    },
    {
        display: 'Orders',
        path: '/dashboard/orders'
    },
    {
        display: 'Users',
        path: '/dashboard/users'
    },
]

const AdminNav = () => {
    const {currentUser} = useAuth();
    const headerRef = useRef(null);
    const profileActionRef = useRef(null);
    const navigate = useNavigate();

    const logout = ()=>{
        signOut(auth).then(()=>{
            toast.success('Logged out');
            navigate('/login')
        }).catch(err=>{
            toast.error(err.message);
        })
    }

    const toggleProfileActions =()=>{
        profileActionRef.current.classList.toggle('show__profileActions');
        console.log(profileActionRef.current);
    } 
    return (
        <>
        <header className="admin__header">
            <div className="admin__nav-top">
                <Container>
                    <div className="admin__wrapper-top">
                        <div className="logo">
                            <h2>2Minutes</h2>
                        </div>
                        <div className="search__box">
                            <input type="text" placeholder="Search...." />
                            <span><i class='ri-search-line'></i></span>
                        </div>
                        <div className="admin__nav-top-right ">
                            <span><i class='ri-notification-3-line'></i></span>
                            <span><i class='ri-settings-2-line'></i></span>
                            <div className="profile">
                            <motion.img 
                                whileTap={{scale:1.2}} 
                                src={currentUser&& currentUser.photoURL} 
                                alt="userIcon" 
                                ref={profileActionRef} 
                                onClick={toggleProfileActions}
                            />

                            <div className="profile__actions " 
                                    ref={profileActionRef} 
                                    >
                                    <span className="text-center d-flex align-items-center justify-content-center" onClick={logout}>Logout</span>
                                    <div  className="d-flex align-items-center justify-content-center flex-column">
                                    <Link to='/'>ِApp</Link>
                                    </div>
                            {/* </div> */}
                            </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </header>
        <section className="admin__menu p-0">
            <Container>
                <Row>
                    <div className="admin__navigation">
                        <ul className="admin__menu-list">
                            {
                                admin__nav.map((item ,index) => (
                                    <li className="admin__menu-item" key={index}>
                                        <NavLink 
                                            to={item.path} 
                                            className={navClass => navClass.isActive ? 'active__admin-menu' : ''}
                                        >
                                            {item.display}
                                        </NavLink>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </Row>
            </Container>
        </section>
        </>
        );
};
export default AdminNav;