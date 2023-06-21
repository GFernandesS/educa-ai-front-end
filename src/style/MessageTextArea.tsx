import styled from "styled-components";
import { Input } from "antd";

const { TextArea } = Input

export const MessageTextArea = styled(TextArea)`
    &&{
    outline: none;
    resize: none;
    margin-left: 3rem;
    line-height: 1;
    width: 70%;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) ;
    padding: 8px 16px;
    box-sizing: border-box;
    background-color: #d9d6db;
    font-size: 17px;
    color: black;
    max-height: 100%;
    height: 50px;
    &&:hover {
        outline: none;
        box-shadow: none;
        border-color: #d9d6db;
    };
    &&:focus {
        outline: none;
        box-shadow: none;
        border-color: #d9d6db;
    }
}
`