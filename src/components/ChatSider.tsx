import { Col, Progress, Row } from "antd";
import { useMutation, UseMutationResult, UseQueryResult } from "react-query";
import { ChatSiderButtonStyle } from "../style/ChatSiderButtonStyle";
import api from '../api/api'

export interface ChatSiderProps {
    contentHeight: number,
}

export function ChatSider({ contentHeight }: ChatSiderProps) {
    return (
        <div style={{ backgroundColor: "#272322", height: contentHeight, color: 'white', display: 'flex', flexDirection: 'column', maxHeight: contentHeight, font: 'normal normal normal Poppins', width: '100%' }}>
            <Row style={{ marginTop: '2.5rem' }}>
                <Col span={24} style={{ textAlign: 'center', font: 'normal normal normal 12px/38px Poppins' }}>
                    Total de sessões disponíveis:
                </Col>
            </Row>
            {
                <Row style={{ width: '100%', justifyContent: 'center' }}>
                    <ChatSiderButtonStyle>
                        Iniciar nova sessão
                    </ChatSiderButtonStyle>
                </Row>

            }
            <Row style={{ width: '100%', justifyContent: 'center' }}>
                <ChatSiderButtonStyle>
                    Adquirir novas sessões
                </ChatSiderButtonStyle>
            </Row>
        </div>
    )
}
