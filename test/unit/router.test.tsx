import express from 'express';
import request from 'supertest';
import { describe, expect, it, jest } from '@jest/globals';
import { router } from '../../src/server/routes';
import { CheckoutResponse, Order, Product } from '../../src/common/types';

const products = [
    {
        id: 1,
        name: 'Product 1',
        price: 100,
        description: 'Description 1',
        material: 'Material 1',
        color: 'Red',
    },
    {
        id: 2,
        name: 'Product 2',
        price: 200,
        description: 'Description 2',
        material: 'Material 2',
        color: 'Blue',
    },
];

const shortProducts = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
];

const cart = [
    {
        id: 1,
        form: { name: 'TEST', phone: '1234567890', address: '123 TEST' },
        cart: {
            1: { name: 'Product 1', price: 100, count: 2 },
            2: { name: 'Product 2', price: 200, count: 1 },
        },
    },
];

const order: Order = {
    form: { name: 'TEST', phone: '123456890', address: '123 TEST' },
    cart: {
        1: { name: 'Product 1', price: 100, count: 2 },
        2: { name: 'Product 2', price: 200, count: 1 },
    },
};

const api = express();
api.use(express.json());
api.use('/', router);

jest.mock('../../src/server/data', () => {
    return {
        ExampleStore: jest.fn().mockImplementation(() => {
            return {
                getAllProducts: jest.fn().mockReturnValue(shortProducts),
                getProductById: jest.fn((id: number) => {
                    if (id === 1) {
                        return products[0];
                    } else if (id === 2) {
                        return products[1];
                    } else {
                        return null;
                    }
                }),
                createOrder: jest.fn((order: Order) => {
                    return 1;
                }),
                getLatestOrders: jest.fn().mockReturnValue(cart),
            };
        }),
    };
});

describe('GET /', () => {
    it('проверка запроса на урл', async () => {
        const response = await request(api).get('/');
        expect(response.status).toEqual(200);
    });
});

describe('POST /api/checkout', () => {
    it('проверка запроса на урл', async () => {
        const response = await request(api).post('/api/checkout');
        expect(response.status).toEqual(200);
    });

    it('должен создать заказ и вернуть его id', async () => {
        const response = await request(api).post('/api/checkout').send(order).expect(200);

        // Проверяем, что в ответе содержится корректный объект CheckoutResponse
        const responseBody: CheckoutResponse = response.body;
        expect(responseBody).toHaveProperty('id');

        expect(typeof responseBody.id).toBe('number');

        // Проверка, что id не является временной меткой
        expect(responseBody.id).toBeGreaterThan(0);
        expect(responseBody.id).toBeLessThan(99999);
    });
});

describe('GET /api/products/:id', () => {
    it('по гет запросу с id товара на урл должен вернуть корректный продукт по его id', async () => {
        const response = await request(api).get('/api/products/1').expect(200);

        const product: Product = response.body;
        expect(product).toEqual(products[0]);
    });

    it('по гет запросу на урл с id несуществующего продукта должен вернуть null', async () => {
        const response = await request(api).get('/api/products/999').expect(200);

        const product: Product | null = response.body;
        expect(product).toBeNull();
    });
});
