import React, {forwardRef} from "react";
import styles from './Card.module.scss'
import {useDispatch} from "react-redux";
import {deleteCart} from "../../redux/slices/card/slice";
import {useNavigate} from "react-router-dom";

export interface CartProps {
    id: number;
    login: string;
    name: string;
    type: string;
    avatar: string;
    stars:number
}


const Cart = forwardRef<HTMLDivElement, CartProps>(({id, login, name, type, avatar, stars}, ref) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const clickUpdate = () => {
        navigate('/update', {
            state: {
                id, login, name, type, avatar

            }
        })
    }

    return (


        <div className={`${styles.cart}  p-3 container d-flex flex-column`} ref={ref}>
            <div className={'row'}>
                <div className={'col d-flex flex-column justify-content-center '}>
                    <i className="bi bi-star-fill"></i>
                    <span>{stars}</span>
                    <img src={avatar} alt='avatar'/>
                    <span>{id}</span>
                </div>
                <div className={'col d-flex flex-column gap-2'}>
                    <span>Login: {login}</span>
                    <span>Name: {name}</span>
                    <span>Type: {type}</span>
                </div>
                <div className={'col d-flex gap-2'}>
                    <button className={'btn btn-secondary'} onClick={clickUpdate}>Редактировать</button>

                    <button className={'btn btn-danger'} type='button' onClick={() => {
                        dispatch(deleteCart(id))
                    }}>Удалить
                    </button>

                </div>
            </div>


        </div>


    );
});

export default Cart