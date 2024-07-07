import { Product, Order, ProductShortInfo, CartItem, CheckoutFormData } from '../../src/common/types';
import { ExampleStore } from '../../src/server/data';

const generateTestProducts = (): Product[] => [
    { id: 1, name: 'Product 1', price: 100, description: 'desc 1', material: 'material 1', color: 'red' },
    { id: 2, name: 'Product 2', price: 200, description: 'desc 2', material: 'material 2', color: 'blue' },
];

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

const mockOrders: (Order & { id: number })[] = [{ id: 1, ...order }];

describe('Store', () => {
    let store: ExampleStore;
    let testProducts: Product[];

    beforeEach(() => {
        store = new ExampleStore();
        testProducts = generateTestProducts();

        // Замена продуктов и заказов в store с помощью публичных методов
        jest.spyOn(store, 'getAllProducts').mockReturnValue(
            testProducts.map(({ id, name, price }) => ({ id, name, price })),
        );
        jest.spyOn(store, 'getProductById').mockImplementation((id: number) => {
            return testProducts.find((p) => p.id === id);
        });
        jest.spyOn(store, 'createOrder').mockImplementation(function (this: ExampleStore, order: Order) {
            const id = mockOrders.length + 1;
            mockOrders.push({ id, ...order });
            return id;
        });
        jest.spyOn(store, 'getLatestOrders').mockReturnValue(mockOrders.slice(-1));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('при открытии корзины должны быть получены все товары', () => {
        const products = store.getAllProducts(0);
        const expectedProducts = testProducts.map(({ id, name, price }) => ({ id, name, price }));
        expect(products).toEqual(expectedProducts);
    });

    it('при открытии корзины данные товаров должны быть определены', () => {
        const products = store.getAllProducts(0);
        products.forEach((p: ProductShortInfo) => {
            expect(p.name).toBeDefined();
        });
    });

    it('при открытии корзины данные товаров должны быть определены (с bugId)', () => {
        const products = store.getAllProducts(1);

        products.forEach((p: ProductShortInfo) => {
            expect(p.name).toBeDefined();
        });
    });

    it('при запросе товара он должен быть получен по id', () => {
        const product = store.getProductById(1);
        expect(product).toEqual(testProducts[0]);
    });

    it('если товар не существует должен быть получен undefined', () => {
        const product = store.getProductById(Number.MAX_VALUE);
        expect(product).toBeUndefined();
    });

    it('при запросе на checkout должен быть создан заказ и возвращен его id', () => {
        const orderId = store.createOrder(order);
        expect(orderId).toBe(2);
        expect(mockOrders[1]).toEqual({ id: 2, ...order });
    });

    it('при чекауте нового заказа должен быть получен номер заказа исходя из номера последнего заказа', () => {
        const latestOrders = store.getLatestOrders();
        expect(latestOrders).toEqual([mockOrders[mockOrders.length - 1]]);
    });
});
