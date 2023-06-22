import logo from '../assets/edu.png'
import React from 'react'
import '../css/content-edu-image.css'
import { Col, Row } from 'antd'

export interface SideContentProps {
    children?: any
}

export function ContentWithEduImage({ children }: SideContentProps) {
    return (
        <>
            <Row style={{marginTop: '20px'}}>
                <Col span={8} />
                <Col span={8} style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={logo} className="edu-logo" />
                </Col>
                <Col span={8} />
            </Row>
            {React.Children.map(children, (child) => React.cloneElement(child))}
        </>
    )
}