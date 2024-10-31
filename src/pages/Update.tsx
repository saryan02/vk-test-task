import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {updateCart} from "../redux/slices/card/slice";
import styles from './Update.module.scss'

interface CartState {
    id: number;
    login: string;
    name: string;
    type: string;
    avatar: string;
}

const Update: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const {id, login, name, type, avatar} = location.state as CartState;


    const getUpdateCart = (fromForm: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(fromForm.currentTarget);
        const updatedData = {
            id: id,
            login: (formData.get('login') as string) || '',
            name: (formData.get('name') as string) || '',
            type: (formData.get('type') as string) || '',
        };

        dispatch(updateCart(updatedData))
        navigate('/')
    };

    return (
        <>
            <div className={`${styles.root} d-flex flex-column  gap-2`}>
                <img src={avatar} alt="avatar"/>
                <form className={'d-flex flex-column gap-1 '} onSubmit={getUpdateCart}>
                    <input name="id" type="text" value={id} disabled/>
                    <input name="login" type="text" defaultValue={login}/>
                    <input name="name" type="text" defaultValue={name}/>
                    <select name="type" defaultValue={type}>
                        <option value="Organization">Organization</option>
                        <option value="User">User</option>
                    </select>
                    <button type="submit">Сохранить</button>
                </form>
            </div>
        </>
    );
};

export default Update;
