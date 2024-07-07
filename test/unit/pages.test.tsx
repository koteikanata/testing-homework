import React from 'react';

import { render, getByText } from '@testing-library/react';
import { Home } from '../../src/client/pages/Home';
import { Delivery } from '../../src/client/pages/Delivery';
import { Contacts } from '../../src/client/pages/Contacts';

describe('Pages', () => {
    it('страница Home должна иметь статическое содержимое', async () => {
        render(<Home />);

        expect(getByText(document.body, 'Welcome to Kogtetochka store!'));
    });

    it('страница Delivery должна иметь статическое содержимое', async () => {
        render(<Delivery />);

        expect(getByText(document.body, 'Delivery'));
    });

    it('страница Contacts должна иметь статическое содержимое', async () => {
        render(<Contacts />);

        expect(getByText(document.body, 'Contacts'));
    });
});
