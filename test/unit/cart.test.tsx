import { ExampleStore } from '../../src/server/data';
import { CartItem, CheckoutFormData, Order, Product, ProductShortInfo } from '../../src/common/types';

const itemsCart: CartItem[] = [
    { name: 'kog', price: 300, count: 5 },
    { name: 'for', price: 500, count: 2 },
];

const form: CheckoutFormData = {
    name: 'who',
    phone: '12345667890',
    address: 'where',
};

const order: Order = { form, cart: { 1: itemsCart[0] } };

describe('Store', () => {
    let store: ExampleStore;
    let testProducts: ProductShortInfo[];

    beforeEach(() => {
        store = new ExampleStore();
        testProducts = store.getAllProducts(0);
    });

    it('при открытии корзины должны быть получены все товары', () => {
        const products = store.getAllProducts(Number(process.env.BUG_ID));
        const expectedProducts = testProducts.map(({ id, name, price }) => ({ id, name, price }));
        expect(products).toEqual(expectedProducts);
    });

    it('при открытии корзины данные товаров должны быть определены', () => {
        testProducts.forEach((p: ProductShortInfo) => {
            expect(p.name).toBeDefined();
        });
    });

    it('при запросе товара он должен быть получен по id', () => {
        const product = store.getProductById(testProducts[0].id);
        expect(product?.id).toEqual(testProducts[0].id);
    });

    it('если товар не существует должен быть получен undefined', () => {
        const product = store.getProductById(Number.MAX_VALUE);
        expect(product).toBeUndefined();
    });

    it('при запросе на checkout должен быть создан заказ и возвращен его id', () => {
        const orderId = store.createOrder(order);
        expect(orderId).toBe(1);
        expect(store.getLatestOrders()).toContainEqual({ id: orderId, ...order });
    });

    it('при чекауте нового заказа должен быть получен номер заказа исходя из номера последнего заказа', () => {
        const newOrder = { form, cart: { 2: itemsCart[1] } };
        store.createOrder(order);
        const orderId = store.createOrder(newOrder);
        expect(orderId).toBe(2); // Второй заказ
        expect(store.getLatestOrders()).toContainEqual({ id: orderId, ...newOrder });
    });

    it('при запросе последних заказов должны быть возвращены последние созданные заказы', () => {
        store.createOrder(order);
        const latestOrders = store.getLatestOrders();
        expect(latestOrders).toEqual([{ id: 1, ...order }]);
    });
});
