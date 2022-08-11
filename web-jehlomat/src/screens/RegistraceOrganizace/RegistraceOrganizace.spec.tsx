import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RegistraceOrganizace from './RegistraceOrganizace';
import axios from 'axios';
import API from '../../config/baseURL';

jest.mock('axios', () => {
    return {
        create: jest.fn(() => ({
            post: jest.fn(),
            get: jest.fn(),
            interceptors: {
                request: { use: jest.fn(), eject: jest.fn() },
                response: { use: jest.fn(), eject: jest.fn() },
            },
        })),
    };
});
const mockedAxios = API as jest.Mocked<typeof axios>;

beforeEach(cleanup);
describe('Provide valid values', () => {
    it('set Organization name', async () => {
        const { container } = render(<RegistraceOrganizace />);
        const name: HTMLInputElement | null = container.querySelector('input[name="organizace"]');
        const email: HTMLInputElement | null = container.querySelector('input[name="email"]');
        const password: HTMLInputElement | null = container.querySelector('input[name="heslo"]');
        const passwordConfig: HTMLInputElement | null = container.querySelector('input[name="hesloConfirm"]');

        await waitFor(() => {
            if (name) {
                fireEvent.change(name, {
                    target: {
                        value: 'mockname',
                    },
                });
            }
        });

        expect(name?.value).toBe('mockname');
        expect(email?.value).toBe('');
        expect(password?.value).toBe('');
        expect(passwordConfig?.value).toBe('');
    });

    it('set valid Email', async () => {
        const { container } = render(<RegistraceOrganizace />);
        const name: HTMLInputElement | null = container.querySelector('input[name="organizace"]');
        const email: HTMLInputElement | null = container.querySelector('input[name="email"]');
        const password: HTMLInputElement | null = container.querySelector('input[name="heslo"]');
        const passwordConfig: HTMLInputElement | null = container.querySelector('input[name="hesloConfirm"]');

        await waitFor(() => {
            if (email) {
                fireEvent.change(email, {
                    target: {
                        value: 'mock@email.com',
                    },
                });
            }
        });

        expect(name?.value).toBe('');
        expect(email?.value).toBe('mock@email.com');
        expect(password?.value).toBe('');
        expect(passwordConfig?.value).toBe('');
    });

    it('set valid Passwords', async () => {
        const { container } = render(<RegistraceOrganizace />);
        const name: HTMLInputElement | null = container.querySelector('input[name="organizace"]');
        const email: HTMLInputElement | null = container.querySelector('input[name="email"]');
        const password: HTMLInputElement | null = container.querySelector('input[name="heslo"]');
        const passwordConfig: HTMLInputElement | null = container.querySelector('input[name="hesloConfirm"]');

        const heslo = 'heslo12345';
        await waitFor(() => {
            if (password) {
                fireEvent.change(password, {
                    target: {
                        value: heslo,
                    },
                });
            }
            if (passwordConfig) {
                fireEvent.change(passwordConfig, {
                    target: {
                        value: heslo,
                    },
                });
            }
        });

        expect(name?.value).toBe('');
        expect(email?.value).toBe('');
        expect(password?.value).toBe(heslo);
        expect(passwordConfig?.value).toBe(heslo);
    });
});
describe('Provide invalid values', () => {
    it('set ivalid - short passwords', async () => {
        const { container, getByText } = render(<RegistraceOrganizace />);

        const name: HTMLInputElement | null = container.querySelector('input[name="organizace"]');
        const email: HTMLInputElement | null = container.querySelector('input[name="email"]');
        const password: HTMLInputElement | null = container.querySelector('input[name="heslo"]');
        const passwordConfig: HTMLInputElement | null = container.querySelector('input[name="hesloConfirm"]');

        const heslo = 'Kratke';
        await waitFor(() => {
            if (password) {
                fireEvent.change(password, {
                    target: {
                        value: heslo,
                    },
                });
            }
        });

        await waitFor(() => {
            password ? fireEvent.blur(password) : null;
            expect(name?.value).toBe('');
            expect(email?.value).toBe('');
            expect(password?.value).toBe(heslo);
            expect(passwordConfig?.value).toBe('');
            expect(screen.getByText('Heslo musí být 8 znaků dlouhé')).toBeInTheDocument();
        });
    });
    it('not a same password', async () => {
        const { container, getByText } = render(<RegistraceOrganizace />);

        const name: HTMLInputElement | null = container.querySelector('input[name="organizace"]');
        const email: HTMLInputElement | null = container.querySelector('input[name="email"]');
        const password: HTMLInputElement | null = container.querySelector('input[name="heslo"]');
        const passwordConfig: HTMLInputElement | null = container.querySelector('input[name="hesloConfirm"]');

        const heslo = 'heslo123456';
        const heslo2 = 'heslo1234567';
        await waitFor(() => {
            if (password) {
                fireEvent.change(password, {
                    target: {
                        value: heslo,
                    },
                });
            }
        });
        await waitFor(() => {
            if (passwordConfig) {
                fireEvent.change(passwordConfig, {
                    target: {
                        value: heslo2,
                    },
                });
            }
        });

        await waitFor(() => {
            password ? fireEvent.blur(password) : null;
            passwordConfig ? fireEvent.blur(passwordConfig) : null;

            expect(name?.value).toBe('');
            expect(email?.value).toBe('');
            expect(password?.value).toBe(heslo);
            expect(passwordConfig?.value).toBe(heslo2);
            expect(screen.getByText('Hesla musí být stejná')).toBeInTheDocument();
        });
    });
});
describe('Form interaction with backend', () => {
    it('submit not unique email', async () => {
        const { container, getByText } = render(<RegistraceOrganizace />);
        const name = container.querySelector('input[name="organizace"]');
        const email = container.querySelector('input[name="email"]');
        const password = container.querySelector('input[name="heslo"]');
        const passwordConf = container.querySelector('input[name="hesloConfirm"]');
        const form = container.querySelector('form');

        mockedAxios.post.mockResolvedValue({
            status: 409,
            data: {
                fieldName: 'email',
                code: 106,
                status: 'Email is not unique',
            },
        });

        await waitFor(() => {
            if (name) {
                fireEvent.change(name, {
                    target: {
                        value: 'mockname',
                    },
                });
            }
        });

        await waitFor(() => {
            if (email) {
                fireEvent.change(email, {
                    target: {
                        value: 'mock@email.com',
                    },
                });
            }
        });

        await waitFor(() => {
            if (password) {
                fireEvent.change(password, {
                    target: {
                        value: 'green12345',
                    },
                });
                fireEvent.blur(password);
            }
        });

        await waitFor(() => {
            if (passwordConf) {
                fireEvent.change(passwordConf, {
                    target: {
                        value: 'green12345',
                    },
                });
                fireEvent.blur(passwordConf);
            }
        });

        await waitFor(() => {
            if (form) {
                fireEvent.submit(form);
            }
        });

        await waitFor(() => {
            expect(getByText('Email is not unique')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(container.querySelector('.Mui-error')).toBeInTheDocument();
        });
    });

    it('submit valid data', async () => {
        const { container, getByText } = render(<RegistraceOrganizace />);
        const name = container.querySelector('input[name="organizace"]');
        const email = container.querySelector('input[name="email"]');
        const password = container.querySelector('input[name="heslo"]');
        const passwordConf = container.querySelector('input[name="hesloConfirm"]');
        const form = container.querySelector('form');

        mockedAxios.post.mockResolvedValue({
            status: 200,
            data: {
                id: '123123123123',
                organizace: 'mockname',
                email: 'mock@email.com',
            },
        });

        await waitFor(() => {
            if (name) {
                fireEvent.change(name, {
                    target: {
                        value: 'mockname',
                    },
                });
            }
        });

        await waitFor(() => {
            if (email) {
                fireEvent.change(email, {
                    target: {
                        value: 'mock@email.com',
                    },
                });
            }
        });

        await waitFor(() => {
            if (password) {
                fireEvent.change(password, {
                    target: {
                        value: 'green12345',
                    },
                });
                fireEvent.blur(password);
            }
        });

        await waitFor(() => {
            if (passwordConf) {
                fireEvent.change(passwordConf, {
                    target: {
                        value: 'green12345',
                    },
                });
                fireEvent.blur(passwordConf);
            }
        });

        await waitFor(() => {
            if (form) {
                fireEvent.submit(form);
            }
        });

        await waitFor(() => {
            expect(container.querySelector('.Mui-error')).not.toBeInTheDocument();
        });
    });
});
