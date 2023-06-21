import { Layout } from "antd"
import styled from "styled-components"

const { Content } = Layout

export interface IStyledContentProps {
    contentheight: number,
    hasbackgroundcolor: boolean,
    isflex?: boolean
}

export const StyledContent = styled(Content)<IStyledContentProps>`
    height: ${props => props.contentheight}px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: ${props => props.hasbackgroundcolor ? 'linear-gradient(to right, #1f1f1f, #000000)' : 'transparent'};
`