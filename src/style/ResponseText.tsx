import styled from "styled-components";

export interface ResponseTextProps {
    backgroundcolor: string;
}

export const ResponseText = styled.div<ResponseTextProps>`
    white-space: pre-wrap;
    font-size: 17px;
    padding-left: 20px;
    border: none;
    line-height: 2;
    padding-top: 20px;
    padding-right: 10px;
    padding-bottom: 15px;
    color: white;
    background-color: ${props => props.backgroundcolor};
    min-height: 80px;
    width: 100%;
`