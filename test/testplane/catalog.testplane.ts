describe('Catalog', () => {
    const root = 'http://localhost:3000/hw/store/catalog/';

    it('кнопка добавления товара в корзину на странице товара должна соответствовать ожиданию', async ({ browser }) => {
        await browser.url(`${root}`);
        const el = await browser.$('.ProductItem-DetailsLink');
        await el.click();

        await browser.assertView('plain', '.ProductDetails-AddToCart');
    });
});
