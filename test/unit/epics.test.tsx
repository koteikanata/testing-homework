import { Store } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { of } from 'rxjs';
import { initStore, rootEpic } from '../../src/client/store';
import { productsLoad, productDetailsLoad, checkout, addToCart, clearCart } from '../../src/client/store';
import { ExampleApi, CartApi } from '../../src/client/api';
import { ApplicationState, Action } from '../../src/client/store';

const product = {
    id: 1,
    name: 'Product 1',
    price: 100,
    description: 'Description 1',
    material: 'Material 1',
    color: 'Red',
};

const shortProduct = {
    id: 1,
    name: 'Product 1',
    price: 100,
};

const mockProducts = [shortProduct];

const mockResponse = { id: 123 };

const form = { name: 'TEST', phone: '123-456-7890', address: '123 ADDRESS' };
const cart = { 1: { name: 'Product 1', price: 100, count: 2 } };

jest.mock('../../src/client/api', () => {
    return {
        ExampleApi: jest.fn().mockImplementation(() => {
            return {
                getProducts: jest.fn(),
                getProductById: jest.fn(),
                checkout: jest.fn(),
            };
        }),
        CartApi: jest.fn().mockImplementation(() => {
            return {
                getState: jest.fn(() => ({})),
                setState: jest.fn(),
            };
        }),
    };
});

const mockApi = new ExampleApi('');
const mockCart = new CartApi();
const epicMiddleware = createEpicMiddleware<Action, Action, ApplicationState, { api: ExampleApi; cart: CartApi }>({
    dependencies: { api: mockApi, cart: mockCart },
});

let store: Store<ApplicationState, Action, unknown>;

beforeEach(() => {
    store = initStore(mockApi, mockCart);
    jest.clearAllMocks();
});

epicMiddleware.run(rootEpic);

describe('Epics', () => {
    it('productsLoadEpic - должен обрабатывать действие PRODUCTS_LOAD и загружать продукты', async () => {
        (mockApi.getProducts as jest.Mock).mockReturnValue(of({ data: mockProducts }));
        store.dispatch(productsLoad());
        await imitateAsync();

        const state = store.getState() as ApplicationState;
        expect(state.products).toEqual(mockProducts);
    });

    it('productDetailsLoadEpic - должен обрабатывать действие PRODUCT_DETAILS_LOAD и загружать детали продукта', async () => {
        (mockApi.getProductById as jest.Mock).mockReturnValue(of({ data: shortProduct }));
        store.dispatch(productDetailsLoad(1));
        await imitateAsync();

        const state = store.getState() as ApplicationState;
        expect(state.details[1]).toEqual(shortProduct);
    });

    it('checkoutEpic - должен обрабатывать действие CHECKOUT и оформлять заказ', async () => {
        (mockApi.checkout as jest.Mock).mockReturnValue(of({ data: mockResponse }));
        store.dispatch(checkout(form, cart));
        await imitateAsync();

        const state = store.getState() as ApplicationState;
        expect(state.latestOrderId).toEqual(mockResponse.id);
        expect(state.cart).toEqual({});
    });

    it('shoppingCartEpic - должен обрабатывать действие ADD_TO_CART и добавлять продукт в корзину', async () => {
        store.dispatch(addToCart(product));
        await imitateAsync();

        const state = store.getState() as ApplicationState;
        expect(state.cart).toBeDefined();
        expect(state.cart[1]).toBeDefined();
        expect(state.cart[1].name).toEqual(product.name);
        expect(mockCart.setState).toHaveBeenCalled();
    });

    it('shoppingCartEpic - должен обрабатывать действие CLEAR_CART и очищать корзину', async () => {
        store.dispatch(clearCart());
        await imitateAsync();

        const state = store.getState() as ApplicationState;
        expect(state.cart).toEqual({});
        expect(mockCart.setState).toHaveBeenCalled();
    });
});

async function imitateAsync() {
    await new Promise((resolve) => setTimeout(resolve, 0));
}
