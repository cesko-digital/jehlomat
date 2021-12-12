import React from 'react';

export interface IIconButon extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    leftElement?: React.ReactNode;
}
