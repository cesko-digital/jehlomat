import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Resizer from 'react-image-file-resizer';
import FileUpload, { FileUploadProps } from 'Components/Inputs/FileUpload/FileUpload';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import { H4 } from 'utils/typography';

interface PhotoUploadProps extends Omit<FileUploadProps, 'onChange' | 'value'> {
    onChange: (value: string) => void;
    readOnly?: boolean;
}

const resizeFile = (file: File) =>
    new Promise(resolve => {
        Resizer.imageFileResizer(
            file,
            2048,
            2048,
            'JPEG',
            80,
            0,
            uri => {
                resolve(uri);
            },
            'base64',
        );
    });

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onChange, readOnly }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [filesResizing, setFilesResizing] = useState(false);
    const [encodedFiles, setEncodedFiles] = useState<string[]>([]);
    const isMobile = useMediaQuery(media.lte('mobile'));

    useEffect(() => {
        const resizeFiles = async () => {
            setFilesResizing(true);
            const promises = files.map(file => resizeFile(file));

            const base64files = (await Promise.all(promises)) as string[];

            setEncodedFiles(base64files);
            onChange(JSON.stringify(base64files));
            setFilesResizing(false);
        };

        if (files.length) {
            resizeFiles();
        }
    }, [files]);

    return (
        <>
            {!readOnly && <FileUpload value={files} onChange={setFiles} accept={'image/*'} maxFiles={3} />}

            {filesResizing && (
                <Box mt={2}>
                    <Typography variant="subtitle2">Zpracování fotek, počkejte prosím</Typography>
                    <LinearProgress />
                </Box>
            )}

            {encodedFiles.length > 0 && readOnly && (
                <Box mt={2} maxWidth="100%">
                    <Box sx={{ overflowX: 'scroll' }} display="flex" alignItems="flex-start">
                        {encodedFiles.map(photo => (
                            <>
                                <Box component="img" src={photo} width={isMobile ? 150 : 400} mr={2} />
                            </>
                        ))}
                    </Box>
                </Box>
            )}
        </>
    );
};

export default PhotoUpload;
