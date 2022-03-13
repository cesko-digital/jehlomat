import React from 'react';
import MaterialUpload, { FileUploadProps as MaterialProps } from 'react-material-file-upload';
import styled from '@emotion/styled';
import { primary, primaryDark } from 'utils/colors';

export interface FileUploadProps extends MaterialProps {}

const StyledWrapper = styled.div`
    width: 100%;
   
  
    .MuiBox-root {
        width: 100%;
        box-sizing: border-box;
    }
`;

export const FileUpload: React.FC<FileUploadProps> = props => (
    <StyledWrapper>
        <MaterialUpload title="Nahrajte soubory" buttonText="Vybrat" buttonProps={{ sx: { backgroundColor: primaryDark } }} {...props} />
    </StyledWrapper>
);

export default FileUpload;
