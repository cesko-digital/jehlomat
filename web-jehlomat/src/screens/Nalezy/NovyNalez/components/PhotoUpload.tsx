import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ImageViewer from 'react-simple-image-viewer';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Resizer  from 'react-image-file-resizer';

import FileUpload, { FileUploadProps } from 'Components/Inputs/FileUpload/FileUpload';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import {dataURLtoFile} from "utils/url";

interface PhotoUploadProps extends Omit<FileUploadProps, 'onChange' | 'value'> {
    onChange: (value: string) => void;
    readOnly?: boolean;
    value?: string[];
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



export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onChange, readOnly, value }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [filesResizing, setFilesResizing] = useState(false);
    const [encodedFiles, setEncodedFiles] = useState<string[]>(value || []);
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const isMobile = useMediaQuery(media.lte('mobile'));

    console.log({ value, encodedFiles });

    const openImageViewer = useCallback(index => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    useEffect(() => {
        // resize files
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

    useEffect(() => {
        if(value && files.length < (value?.length || 0)) {
            const files = value.map((string, index) => dataURLtoFile(string, `${index}`))

            setFiles(files)
        }
    },  [])

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
                <Box mt={2} width="100%">
                    <Box
                        sx={{ overflowX: 'scroll', border: '1px solid rgba(0, 0, 0, 0.23)', padding: '16px 14px', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }}
                        display="flex"
                        alignItems="flex-start"
                    >
                        {encodedFiles.map((photo, index) => (
                            <>
                                <Box
                                    component="img"
                                    src={photo}
                                    width={isMobile ? 150 : 400}
                                    mr={2}
                                    onClick={() => openImageViewer(index)}
                                    sx={{
                                        transition: '.1s all',
                                        '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' },
                                    }}
                                />
                            </>
                        ))}
                    </Box>
                </Box>
            )}

            {isViewerOpen && (
                <ImageViewer src={encodedFiles} currentIndex={currentImage} disableScroll={false} closeOnClickOutside={true} onClose={closeImageViewer} backgroundStyle={{ zIndex: 100 }} />
            )}
        </>
    );
};

export default PhotoUpload;
