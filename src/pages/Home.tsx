import React, {createRef, useCallback, useEffect, useRef, useState} from "react";
import Cart from "../components/card";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../redux/store";
import {fetchCarts} from "../redux/slices/card/slice";
import Filter from "../components/filter";
import {setSort} from "../redux/slices/filter/slice";
import {selectItems, selectTotalCount} from "../redux/slices/card/selectors";
import {selectSort} from "../redux/slices/filter/selectors";

const Home: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const lastItem = createRef<HTMLDivElement>();
    const carts = useSelector(selectItems);
    const totalCount = useSelector(selectTotalCount);
    const sort = useSelector(selectSort)
    const [page, setPage] = useState(1)
    const observerLoader = useRef<IntersectionObserver | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    const handleSortChange = (newSort: 'asc' | 'desc' | '') => {
        dispatch(setSort(newSort));
        setPage(1);
        dispatch(fetchCarts({page: 1, sort: newSort}));
    };
    const actionInSight = useCallback((entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && carts.length < totalCount && !isLoading) {
            setIsLoading(true);
            setPage((prevPage) => {
                const page = prevPage + 1;
                dispatch(fetchCarts({page, sort})).finally(() => setIsLoading(false));
                return page;
            });
        }
    }, [carts.length, totalCount, isLoading, sort, dispatch]);

    useEffect(() => {
        setPage(1);
        setIsLoading(true);
        dispatch(fetchCarts({page: 1, sort})).finally(() => setIsLoading(false));
    }, [dispatch, sort]);


    useEffect(() => {
        if (observerLoader.current) {
            observerLoader.current.disconnect();
        }

        observerLoader.current = new IntersectionObserver(actionInSight);

        if (lastItem.current) {
            observerLoader.current.observe(lastItem.current);
        }

        return () => {
            if (observerLoader.current) {
                observerLoader.current.disconnect();
            }
        };
    }, [lastItem, carts, isLoading, totalCount, actionInSight]);


    return (
        <>
            <div className={'d-flex flex-column align-items-center gap-5 mt-3'}>
                <Filter onSortChange={handleSortChange}/>
                {carts.length > 0 &&
                    carts.map((cart, index) => {
                        if (index + 1 === carts.length) {
                            return <Cart key={cart.id}
                                         id={cart.id}
                                         login={cart.login}
                                         name={cart.name}
                                         type={cart.type}
                                         avatar={cart.avatar}
                                         stars={cart.stars}
                                         ref={lastItem}/>
                        }

                        return <Cart key={cart.id} {...cart} />
                    })}
            </div>

            <div className={'text-center'}>
                {isLoading &&
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>}
            </div>
        </>
    )
}
export default Home;