describe('Cart', () => {
    const root = 'http://localhost:3000/hw/store';

    it('при оформлении заказа message должен соответствовать ожиданию', async ({ browser }) => {
        await browser.url(`${root}/catalog`);
        const el = await browser.$('.ProductItem-DetailsLink');
        await el.click();

        const elAdd = await browser.$('.ProductDetails-AddToCart');
        await elAdd.click();

        const cart = await browser.$(`a[href='/hw/store/cart']`);
        await cart.click();

        await browser.$('#f-name').addValue('test');
        await browser.$('#f-phone').addValue('0000000000');
        await browser.$('#f-address').addValue('test');

        const submit = await browser.$('.Form-Submit');
        await submit.click();

        await browser.$('.Cart-SuccessMessage').waitForDisplayed();
        await browser.assertView('plain', '.Cart-SuccessMessage');
    });
});
