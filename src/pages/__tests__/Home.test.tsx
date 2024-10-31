import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../Home";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk, { ThunkMiddleware } from 'redux-thunk';
import * as reactRedux from "react-redux";
import { fetchCarts } from "../../redux/slices/card/slice";
import {FilterProps} from "../../components/filter";
import {CartProps} from "../../components/card";
import {RootState} from "../../redux/store";
import {Store, Dispatch, Middleware, AnyAction} from 'redux'


jest.mock("../../components/card", () => React.forwardRef<HTMLDivElement, CartProps>((props, ref) => (
    <div ref={ref} data-testid="cart-item">{props.name}</div>
)));
jest.mock("../components/filter", () => (props:FilterProps) => (
    <button onClick={() => props.onSortChange('asc')} data-testid="sort-button">Sort Ascending</button>
));

jest.mock("../redux/slices/card/slice", () => ({
    fetchCarts: jest.fn(),
}));
const middlewares: Array<Middleware<{}, RootState, Dispatch<AnyAction>>> = [thunk as ThunkMiddleware<RootState, AnyAction>];
const mockStore = configureStore<RootState, AnyAction>(middlewares);

describe("Home Component", () => {
    let store:Store<RootState>;
    const cartsMock = [
        { id: 1, login: "user1", name: "User One", type: "type1", avatar: "avatar1", stars: 3 },
        { id: 2, login: "user2", name: "User Two", type: "type2", avatar: "avatar2", stars: 4 },
    ];

    beforeEach(() => {
        store = mockStore({
            card: { items: cartsMock, totalCount: 5 },
            filter: { sort: "" },
        });
        jest.spyOn(reactRedux, "useDispatch").mockReturnValue(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders the Home component and fetches initial data", async () => {
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );


        expect(screen.getByRole("status")).toBeInTheDocument();

        expect(fetchCarts).toHaveBeenCalledWith({ page: 1, sort: "" });
    });

    test("renders cart items and hides loading spinner once data is fetched", async () => {
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        expect(screen.getAllByTestId("cart-item")).toHaveLength(cartsMock.length);

        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    test("sorts carts when sort button is clicked", async () => {
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );


        fireEvent.click(screen.getByTestId("sort-button"));

        await waitFor(() => {
            expect(fetchCarts).toHaveBeenCalledWith({ page: 1, sort: "asc" });
        });
    });

    test("triggers fetching more carts on scroll", async () => {
        const observeMock = jest.fn();
        const disconnectMock = jest.fn();
        window.IntersectionObserver = jest.fn((callback) => ({
            observe: observeMock,
            disconnect: disconnectMock,
            takeRecords: () => [{ isIntersecting: true }],
        }));

        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        expect(observeMock).toHaveBeenCalled();

        await waitFor(() => {
            expect(fetchCarts).toHaveBeenCalledWith({ page: 2, sort: "" });
        });
    });
});
