import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form, FormProps } from '../../src/client/components/Form';

describe('Form Component', () => {
    const setup = (props: Partial<FormProps> = {}) => {
        const defaultProps: FormProps = {
            onSubmit: jest.fn(),
            ...props,
        };
        return render(<Form {...defaultProps} />);
    };

    test('поля формы и кнопка отправки отрендерены', () => {
        setup();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
        expect(screen.getByText(/checkout/i)).toBeInTheDocument();
    });

    test('в случае если поля пустые - отображены ошибки валидации', () => {
        setup();
        fireEvent.click(screen.getByText(/checkout/i));

        expect(screen.getByText(/please provide your name/i)).toBeVisible();
        expect(screen.getByText(/please provide a valid phone/i)).toBeVisible();
        expect(screen.getByText(/please provide a valid address/i)).toBeVisible();
    });

    test('когда форма валидна, вызывается onSubmit с правильными данными', () => {
        const onSubmit = jest.fn();
        setup({ onSubmit });

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'TEST' } });
        fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '123-456-7890' } });
        fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 TEST' } });

        fireEvent.click(screen.getByText(/checkout/i));

        expect(onSubmit).toHaveBeenCalledWith({
            name: 'TEST',
            phone: '123-456-7890',
            address: '123 TEST',
        });
    });

    test('когда форма невалидна, onSubmit не должен вызываться', () => {
        const onSubmit = jest.fn();
        setup({ onSubmit });

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: 'invalid-phone' } });
        fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '' } });

        fireEvent.click(screen.getByText(/checkout/i));

        expect(onSubmit).not.toHaveBeenCalled();
    });

    test('после успешной отправки формы, поля инпута и кнопка должны быть отключены ', () => {
        const onSubmit = jest.fn();
        setup({ onSubmit });

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'TEST' } });
        fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '123-456-7890' } });
        fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 TEST' } });

        fireEvent.click(screen.getByText(/checkout/i));

        expect(screen.getByLabelText(/name/i)).toBeDisabled();
        expect(screen.getByLabelText(/phone/i)).toBeDisabled();
        expect(screen.getByLabelText(/address/i)).toBeDisabled();
        expect(screen.getByText(/checkout/i)).toBeDisabled();
    });
});
