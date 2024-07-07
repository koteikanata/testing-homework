describe('Header', () => {
    const root = 'http://localhost:3000/hw/store/';

    it('по клику в меню на кнопку Catalog, происходит переход на страницу Catalog', async ({ browser }) => {
        await browser.url(root);
        const elem = await browser.$('a=Catalog');
        await elem.click();

        expect(await browser.getUrl()).toContain('/catalog');
    });

    it('по клику в меню на кнопку Delivery, происходит переход на страницу Delivery', async ({ browser }) => {
        await browser.url(root);
        const elem = await browser.$('a=Delivery');
        await elem.click();

        expect(await browser.getUrl()).toContain('/delivery');
    });

    it('по клику в меню на кнопку Contacts, происходит переход на страницу Contacts', async ({ browser }) => {
        await browser.url(root);
        const elem = await browser.$('a=Contacts');
        await elem.click();

        expect(await browser.getUrl()).toContain('/contacts');
    });

    it('по клику в меню на кнопку Cart, происходит переход на страницу Cart', async ({ browser }) => {
        await browser.url(root);
        const elem = await browser.$(`a[href='/hw/store/cart']`);
        await elem.click();

        expect(await browser.getUrl()).toContain('/cart');
    });

    it('название магазина в шапке должно быть ссылкой на главную страницу ', async ({ browser }) => {
        await browser.url(`${root}/delivery`);

        const header = await browser.$('.Application-Brand');
        header.click();

        expect(await browser.getUrl()).toContain('/');
    });
});

describe('Menu', () => {
    const root = 'http://localhost:3000/hw/store/';

    it('навигационное меню при ширине окна менее 576px должно быть скрыто', async ({ browser }) => {
        await browser.url(root);
        await browser.setWindowSize(575, 800);

        const navMenu = await browser.$('.navbar-nav');
        expect(await navMenu.isDisplayed()).toBe(false);
    });

    it('кнопка меню-гамбургера при ширине окна менее 576px должна быть отображена', async ({ browser }) => {
        await browser.url(root);
        await browser.setWindowSize(575, 800);

        const hamburgerMenu = await browser.$('.navbar-toggler-icon');
        expect(await hamburgerMenu.isDisplayed()).toBe(true);
    });

    it('при клике на кнопку из меню-гамбургера, меню должно закрываться', async ({ browser }) => {
        await browser.url(root);
        await browser.setWindowSize(575, 800);

        const hamburgerMenu = await browser.$('.navbar-toggler-icon');
        await hamburgerMenu.click();

        const link = await browser.$('a=Delivery');
        await link.click();

        const navMenu = await browser.$('.navbar-nav');
        expect(await navMenu.isDisplayed()).toBe(false);
    });
});
