describe('Cart', () => {
    const root = 'http://localhost:3000/hw/store';;

    it('при оформлении заказа message должен соответствовать ожиданию', async ({ browser }) => {
        await browser.url(`${root}/catalog?bug_id=8`);
        const el = await browser.$('.ProductItem-DetailsLink');
        el.click();

        const elAdd = await browser.$('.ProductDetails-AddToCart');
        await elAdd.click();

        const cart = await browser.$(`a[href='/hw/store/cart']`);
        await cart.click();

        await browser.$(".Form-Field_type_name").addValue("test");
        await browser.$(".Form-Field_type_phone").addValue("0000000000");
        await browser.$(".Form-Field_type_address").addValue("test");

        const submit = await browser.$('.Form-Submit');
        await submit.click();

        await browser.assertView('plain', '.Cart-SuccessMessage');
    });
})