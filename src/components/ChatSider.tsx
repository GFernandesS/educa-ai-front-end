import { Col, Progress, Row } from "antd";
import { useEffect, useState } from "react";
import { useMutation, UseMutationResult, UseQueryResult } from "react-query";
import { IntegrationType } from "../enums/integration-type-enum";
import { ChatSiderButtonStyle } from "../style/ChatSiderButtonStyle";
import api from '../api/api'

export interface ChatSiderProps {
    quotaQuery: UseQueryResult<{ usedQuota: number, maxPermittedResponses: number, expireMoment: Date }>,
    contentHeight: number,
    countAvailableSessionQuery: UseQueryResult<number>,
    startSessionMutation: UseMutationResult<void, unknown, void, unknown>
}

export function ChatSider({ quotaQuery, countAvailableSessionQuery, startSessionMutation, contentHeight }: ChatSiderProps) {
    const convertRemainingQuotaToPercentage = (maxQuota: number, usedQuota: number) => {
        return Math.round((usedQuota / maxQuota) * 100)
    }

    const [isQuotaExpired, setIsQuotaExpired] = useState(false)

    useEffect(() => {
        setIsQuotaExpired(quotaQuery?.data != undefined && quotaQuery.data.usedQuota >= quotaQuery.data.maxPermittedResponses)
    }, [quotaQuery?.data])

    const integrationMutation = useMutation({
        mutationFn: async (integrationType: number) => {
            await api.post('/integration', {integrationType}, { headers: { "api-key": localStorage.getItem('apiKey') } })
        }
    })

    const handleStartSessionOnClick = async () => {
        await startSessionMutation.mutateAsync()
    }

    const handleIntegration = async (integrationType: IntegrationType) => {
        window.open("https://www.datamotica.com/contato")
        await integrationMutation.mutateAsync(integrationType)
    }

    const handleAddNewSessionsOnClick = () => {
        window.open("https://form.jotform.com/231157228734658")
    }

    return (
        <div style={{ backgroundColor: "#272322", height: contentHeight, color: 'white', display: 'flex', flexDirection: 'column', maxHeight: contentHeight, font: 'normal normal normal Poppins', width: '100%' }}>
            {
                quotaQuery.data && (
                    <>
                        <Row style={{ marginTop: '1rem' }}>
                            <Col md={24} style={{ font: 'normal normal normal 18px/38px Poppins', textAlign: 'center', width: '100%' }}>SESSÃO ATUAL</Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ width: '100%', textAlign: 'center' }}>
                                <Progress
                                    trailColor='#373437'
                                    strokeColor={'#6B2F69'}
                                    size={80}
                                    style={{ color: 'white', marginTop: '1rem', width: '100%' }}
                                    type='circle'
                                    percent={quotaQuery.data && convertRemainingQuotaToPercentage(quotaQuery.data!.maxPermittedResponses, quotaQuery.data!.usedQuota)}
                                    format={(percent) => <p style={{ 'color': 'white' }}>{percent}%</p>} />
                            </Col>
                        </Row>
                    </>
                )
            }
            <Row style={{ marginTop: '2.5rem' }}>
                <Col span={24} style={{ textAlign: 'center', font: 'normal normal normal 12px/38px Poppins' }}>
                    Total de sessões disponíveis: {countAvailableSessionQuery.data}
                </Col>
            </Row>
            {
                ((!quotaQuery.data || isQuotaExpired) && (countAvailableSessionQuery.data != undefined && countAvailableSessionQuery.data > 0)) && (
                    <Row style={{ width: '100%', justifyContent: 'center' }}>
                        <ChatSiderButtonStyle onClick={handleStartSessionOnClick} loading={startSessionMutation.isLoading}>
                            Iniciar nova sessão
                        </ChatSiderButtonStyle>
                    </Row>
                )
            }
            <Row style={{ width: '100%', justifyContent: 'center' }}>
                <ChatSiderButtonStyle onClick={handleAddNewSessionsOnClick}>
                    Adquirir novas sessões
                </ChatSiderButtonStyle>
            </Row>
            <Row style={{ width: '100%', justifyContent: 'center' }}>
                <ChatSiderButtonStyle onClick={async () => await handleIntegration(IntegrationType.Crm)}>
                    Integre com seu CRM
                </ChatSiderButtonStyle>
            </Row>
            <Row style={{ width: '100%', justifyContent: 'center' }}>
                <ChatSiderButtonStyle onClick={async () => await handleIntegration(IntegrationType.Erp)}>
                    Integre com seu ERP
                </ChatSiderButtonStyle>
            </Row>
            <Row style={{ width: '100%', justifyContent: 'center' }}>
                <ChatSiderButtonStyle onClick={async () => await handleIntegration(IntegrationType.DataMotica)}>
                    Integre com DataMotica
                </ChatSiderButtonStyle>
            </Row>
        </div>
    )
}
