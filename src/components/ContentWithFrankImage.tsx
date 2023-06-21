import logo from '../assets/datamotica.png'
import React from 'react'
import '../css/content-frank-image.css'
import { Col, Row } from 'antd'

export interface SideContentProps {
    children?: any
}

export function ContentWithFrankImage({ children }: SideContentProps) {
    return (
        <>
            <Row style={{marginTop: '20px'}}>
                <Col span={8} />
                <Col span={8} style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={logo} className="datamotica-logo" />
                </Col>
                <Col span={8} />
            </Row>
            {React.Children.map(children, (child) => React.cloneElement(child))}
        </>
    )
}