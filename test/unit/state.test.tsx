import { Action, Store } from 'redux';
import { ExampleApi, CartApi } from '../../src/client/api';
import { ApplicationState, initStore } from '../../src/client/store';

const products = [{ id: 2, name: 'Product 2', price: 200 }];
const product = { id: 1, name: 'Product 1', price: 100 };
const details = { id: 1, name: 'Product 1 details' };
const orderId = 123;

describe('createRootReducer', () => {
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    let store: Store<ApplicationState, Action, unknown>;

    beforeEach(() => {
        store = initStore(api, cart);
    });

    it('проверка PRODUCTS_LOAD - должен установить состояние products в undefined', () => {
        store.dispatch({ type: 'PRODUCTS_LOAD' });
        const newState: ApplicationState = store.getState();
        expect(newState.products).toBeUndefined();
    });

    it('проверка PRODUCTS_LOADED - должен установить состояние products в заданные продукты', () => {
        store.dispatch({ type: 'PRODUCTS_LOADED', products });
        const newState: ApplicationState = store.getState();
        expect(newState.products).toEqual(products);
    });

    it('проверка PRODUCT_DETAILS_LOADED - должен добавить детали продукта в состояние', () => {
        store.dispatch({ type: 'PRODUCT_DETAILS_LOADED', details });
        const newState: ApplicationState = store.getState();
        expect(newState.details[details.id]).toEqual(details);
    });

    it('проверка ADD_TO_CART - должен добавить продукт в корзину, если его там еще нет', () => {
        store.dispatch({ type: 'ADD_TO_CART', product });
        const newState: ApplicationState = store.getState();
        expect(newState.cart[product.id]).toBeDefined();
    });
    
    it('проверка ADD_TO_CART - должен увеличить количество продукта в корзине', () => {
        store.dispatch({ type: 'ADD_TO_CART', product });
        const newState: ApplicationState = store.getState();
        expect(newState.cart[product.id].count).toBe(2);
    });

    it('проверка CLEAR_CART - должен очистить корзину', () => {
        store.dispatch({ type: 'CLEAR_CART' });
        const newState: ApplicationState = store.getState();
        expect(newState.cart).toEqual({});
    });

    it('проверка CHECKOUT_COMPLETE - должен установить последний идентификатор заказа и очистить корзину', () => {
        store.dispatch({ type: 'CHECKOUT_COMPLETE', orderId });
        const newState: ApplicationState = store.getState();
        expect(newState.latestOrderId).toBe(orderId);
        expect(newState.cart).toEqual({});
    });

    it('возврат состояния по умолчанию, если действие не совпадает - состояние не должно измениться', () => {
        const initialState = store.getState();
        store.dispatch({ type: 'UNKNOWN_ACTION' });
        const newState = store.getState();
        expect(newState).toEqual(initialState);
    });
});
