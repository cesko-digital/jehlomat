import Modal from 'Components/Modal/Modal';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { Component, RefObject } from 'react';
import { primaryDark } from 'utils/colors';

const Text = styled(Typography)`
    text-align: center;
    font-size: 38px;
    color: ${primaryDark};
    font-weight: 700;
`;

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 361px;
    padding: 30px;
`;

interface IProps {
    ref: RefObject<ConfirmationModal>;
}

interface IState {
    show: boolean;
    title: string;
    confirmText: string;
    cancelText: string;
}

type TPayload = 'confirm' | 'cancel'

interface IPromiseInfo {
    resolve: (payload: TPayload) => void;
}

interface IShowParams {
    title: string;
    confirmText: string;
    cancelText: string;
}

class ConfirmationModal extends Component<IProps, IState> {
    private promiseInfo: IPromiseInfo | null = null;

    constructor(props: IProps) {
        super(props);
        this.state = {
            show: false,
            title: '',
            confirmText: '',
            cancelText: '',
        };
    }

    show = async ({ title, confirmText, cancelText }: IShowParams): Promise<TPayload> => {
        return new Promise(resolve => {
            this.promiseInfo = {
                resolve,
            };
            this.setState({
                show: true,
                title,
                confirmText,
                cancelText,
            });
        });
    };

    hide = () => {
        this.setState({
            show: false,
        });
    };

    handleCancel = () => {
        this.hide();
        this.promiseInfo?.resolve('cancel');
    };

    handleConfirm = () => {
        this.hide();
        this.promiseInfo?.resolve('confirm');
    };

    render() {
        return (
            <Modal modalHeaderText="" open={this.state.show} onClose={this.handleCancel}>
                <Wrapper>
                    <Text variant="h2">{this.state.title}</Text>
                    <Box marginTop="auto" display="flex" justifyContent="space-between">
                        <SecondaryButton onClick={this.handleCancel} text={this.state.cancelText} />
                        <PrimaryButton onClick={this.handleConfirm} text={this.state.confirmText} />
                    </Box>
                </Wrapper>
            </Modal>
        );
    }
}

export default ConfirmationModal;
