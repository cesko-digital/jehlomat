import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';
import { IContentData } from './OrganizationVerification';
import Container from '@mui/material/Container';
import { useMemo } from 'react';
import { primary, white } from '../../utils/colors';
import { Header } from 'Components/Header/Header';

interface IProps {
  contentData: IContentData | null,
  children?: React.ReactNode
}

export const Content = (props: IProps) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('sm'));


  const containerStyles = useMemo(() => ({
    flexGrow: 1,
    display: 'flex',
    backgroundColor: desktop ? white : primary,
    color: desktop ? primary : white,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }), [desktop])

  return (
    <>
      <Header mobileTitle='' />
      <Container sx={containerStyles}>
        {
          props.contentData && (
            <>
              <Typography marginBottom={2} align="center" variant="h4">
                {props.contentData.text}
              </Typography>
              <props.contentData.icon.Component sx={{ color: desktop ? props.contentData.icon.color.desktop : props.contentData.icon.color.mobile, fontSize: 80 }} />
              <Container sx={{ paddingTop: '2em', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                {props.children}
              </Container>
            </>
          )
        }
      </Container>
    </>
  )
}


