import * as S from './styles';
import { FC, useCallback, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';

interface IProps {
    title: string;
    text: string; // could be HTML
}

export const CollapsibleText: FC<IProps> = ({ title, text }) => {
    const [open, setOpen] = useState(false);
    const isMobile = useMediaQuery(media.lte('mobile'));

    const handleClick = useCallback(() => {
        setOpen(!open);
    }, [open, setOpen]);

    return (
        <S.Wrapper>
            <S.TitleBox>
                <S.Icon onClick={handleClick} fontSize="large" open={open} />
                <S.Title onClick={handleClick} variant="body1">
                    {title}
                </S.Title>
            </S.TitleBox>
            {open && (
                <S.TextBox isMobile={isMobile}>
                    <S.Text variant="body1" dangerouslySetInnerHTML={{ __html: text }} />
                </S.TextBox>
            )}
        </S.Wrapper>
    );
};
