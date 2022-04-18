import React, {FunctionComponent, HTMLAttributes} from 'react';
import {styled} from '@mui/system';
import {ReactComponent as SvgZoomIcon} from 'assets/icons/zoom.svg';
import {ReactComponent as SvgChevronDownIcon} from 'assets/icons/chevron-down.svg';

const GRAY = "rgba(217, 217, 217, 1)";
const GREEN = "rgba(14, 118, 108, 1)";
const GREEN_LIGHT = "rgba(14, 118, 108, 0.2)";

export const ZoomIcon = styled(SvgZoomIcon)({
  display: "inline-block",
  height: 16,
  width: 16,
});

export const ChevronDownIcon = styled(SvgChevronDownIcon)({
  display: "inline-block",
  height: 16,
  width: 16,
});

export const Input: FunctionComponent<HTMLAttributes<HTMLInputElement>> = ({ children, ...rest }) => (
  <Wrapper>
    <BaseInput {...rest} />
    {children}
  </Wrapper>
);

export const Select: FunctionComponent<HTMLAttributes<HTMLSelectElement>> = ({ children, ...rest }) => (
  <Wrapper>
    <BaseSelect {...rest}>
      {children}
    </BaseSelect>
    <ChevronDownIcon />
  </Wrapper>
);

const Wrapper = styled('label')({
  alignItems: "center",
  display: "inline-flex",
  border: `1px solid ${GRAY}`,
  borderRadius: 16,
  boxSizing: "border-box",
  color: GREEN,
  flexDirection: "row",
  height: 32,
  lineHeight: 1,
  paddingLeft: 12,
  paddingRight: 12,
  transition: "all 300ms",
  width: "100%",

  "&:focus-within": {
    outline: "none",
    borderColor: GREEN,
    boxShadow: `0 0 0 2px ${GREEN_LIGHT}`,
  },
});

const BaseSelect = styled('select')({
  appearance: "none",
  border: "none",
  color: "#000",
  flexGrow: 1,
  lineHeight: 1,
  padding: 0,
  margin: 0,

  "&:focus": {
    outline: "none",
  },
});

const BaseInput = styled('input')({
  border: "none",
  color: "#000",
  flexGrow: 1,
  lineHeight: 1,
  padding: 0,
  margin: 0,
  
  "&:focus": {
    outline: "none",
  },
});

const Title = styled('h3')({
  color: GREEN,
  fontSize: "1.125rem",
  fontWeight: 400,
  letterSpacing: "1.25px",
  margin: 0,
  padding: 0,
  textTransform: "uppercase",
});

const Reset = styled('div')({
  fontSize: "0.615rem",
  textAlign: "right",
  marginBottom: "8px",
  
  "& > a": {
    color: GREEN,
  }
});

interface FilterProps {
  title: string;
}

export const Filters = styled('div')({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  
  "& > *": {
    marginRight: 32,
    
    "&:last-child": {
      marginRight: 0,
    }
  }
});

export const Filter: FunctionComponent<FilterProps> = ({ title, children }) => (
  <div style={{ width: "100%" }}>
    <Title>{title}</Title>
    <Reset>
      <a href="#">Zrušit filtr</a>
    </Reset>
    {children}
  </div>
);