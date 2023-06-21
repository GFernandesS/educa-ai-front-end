import { Row, Col, Button, List, notification, Spin, Form } from 'antd'
import Header from '../components/FranqIAHeader'
import { useEffect, useRef, useState } from 'react'
import { SendOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import { StyledContent } from '../style/ContentStyle'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../api/api'
import { FrankUserIcon } from '../style/FrankUserIcon'
import logo from '../assets/frank_rosto.png'
import { UserIcon } from '../style/UserIcon'
import { MessageTextArea } from '../style/MessageTextArea'
import { ResponseText } from '../style/ResponseText'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { LoadingSpin } from '../style/LoadingSpin'
import Linkify from 'react-linkify'
import Typewriter from 'typewriter-effect'
import { NegativeFeedbackModal, PositiveFeedbackModal } from '../components/FeedbackModal'
import { ChatSider } from '../components/ChatSider'

export const Chat = () => {
    const [contentHeight, setContentHeight] = useState(0)

    const [message, setMessage] = useState('')

    const navigate = useNavigate()

    const [isPositiveFeedbackModalOpen, setIsPositiveFeedbackModalOpen] = useState(false)

    const [isNegativeFeedbackModalOpen, setIsNegativeFeedbackModalOpen] = useState(false)

    const [currentResponseId, setCurrentResponseId] = useState('')

    const messageInputRef = useRef<any>()

    const [isMenuVisible, setIsMenuVisible] = useState(true)

    const responsesScroll = useRef<any>()

    const queryClient = useQueryClient()

    const [form] = Form.useForm()

    const invalidateQueries = () => {
        queryClient.invalidateQueries('responses')
        queryClient.invalidateQueries('quota')
        queryClient.invalidateQueries('count-available')
    }

    const responseQuery = useQuery<[{ input: string, output: string, responseId: string }]>('responses', async () => {
        if (localStorage.getItem('apiKey')) {
            const response = await api.get('/session/responses', { headers: { "api-key": localStorage.getItem('apiKey') } })
            return response.data
        }
    }, { refetchOnWindowFocus: false })

    const quotaQuery = useQuery<{ usedQuota: number, maxPermittedResponses: number, expireMoment: Date }>('quota', async () => {
        if (localStorage.getItem('apiKey')) {
            const response = await api.get('/session/quota', { headers: { "api-key": localStorage.getItem('apiKey') } })
            return response.data
        }
    }, { refetchOnWindowFocus: false, })

    const availableSessionsQuery = useQuery<number>('count-available', async () => {
        const apiKey = localStorage.getItem('apiKey')

        if (apiKey) {
            const response = await api.get('/session/count-available', { headers: { "api-key": apiKey } })
            return response.data
        }
    }, { refetchOnWindowFocus: false })

    const sendMessageMutation = useMutation({
        mutationFn: async (message: string) => {
            await api.post('/chat', { message }, { headers: { "api-key": localStorage.getItem('apiKey') } })
        },
        onSuccess: () => {
            invalidateQueries()
            messageInputRef.current.focus()
        },
        onError: (error: AxiosError) => {
            const responseData = (error!.response!.data as unknown as { message: string, statusCode: number })

            if (responseData.statusCode != 429)
                notification.error({ message: (error!.response!.data as unknown as { message: string, statusCode: number }).message, duration: 3 })
            else
                queryClient.invalidateQueries('responses')
        }
    })

    const startSessionMutation = useMutation({
        mutationFn: async () => {
            await api.post('/session/start', {}, { headers: { "api-key": localStorage.getItem('apiKey') } })
            invalidateQueries()
        },
        onSuccess: () => {
            notification.success({ message: 'Sessão iniciada com sucesso!', duration: 3 })
        },
        onError: (error: AxiosError) => {
            invalidateQueries()
        }
    })

    useEffect(() => {
        if (!localStorage.getItem('apiKey'))
            navigate('/')
    }, [])

    useEffect(() => {
        if (quotaQuery?.data && quotaQuery.data.usedQuota < quotaQuery.data.maxPermittedResponses && isMenuVisible)
            setIsMenuVisible(false)
    }, [sendMessageMutation?.isLoading, quotaQuery?.data])

    const handleSetIsMenuVisible = () => {
        setIsMenuVisible(!isMenuVisible)
    }

    const handleSendMessage = async (values: any) => {
        if (values.message) {
            form.resetFields()
            setMessage(values.message)
            await sendMessageMutation.mutateAsync(values.message)
            setMessage('')
        }
    }

    useEffect(() => {
        if (!responseQuery.isLoading && responsesScroll.current)
            responsesScroll.current.scrollTo({ top: responsesScroll.current.scrollHeight, behavior: 'auto' })
    }, [responseQuery.isLoading, responseQuery.data, sendMessageMutation.isLoading])

    //TODO: Componentizar lista
    //TODO: Componentizar sider com StyledComponents
    //TODO: Componentizar progress bar
    //TODO: Componentizar botão de envio de mensagem
    return (
        <>
            <Header onClickMenu={handleSetIsMenuVisible} setContentHeight={setContentHeight} isLogged={true} />
            <Spin size='large' indicator={<LoadingSpin />} spinning={quotaQuery.isLoading || responseQuery.isLoading}>
                <Row>
                    {isMenuVisible &&
                        <Col xs={24} md={4}>
                            <ChatSider contentHeight={contentHeight} quotaQuery={quotaQuery} countAvailableSessionQuery={availableSessionsQuery} startSessionMutation={startSessionMutation} />
                        </Col>
                    }
                    <Col md={isMenuVisible ? 20 : 24}>
                        <StyledContent hasbackgroundcolor={false} contentheight={contentHeight}>
                            <div style={{ maxHeight: '100%', height: '100%', backgroundColor: '#373437', width: '100%' }}>
                                <Row ref={responsesScroll} justify='center' align='top' style={{ height: '80%', backgroundColor: '#373437', overflow: 'auto' }}>
                                    <Col span={24} style={{ paddingTop: '5rem', textAlign: 'left' }}>
                                        {
                                            !responseQuery?.data?.length && !sendMessageMutation.isLoading &&
                                            <p style={{ fontSize: '17px', color: 'white', display: 'flex', justifyContent: 'center' }}>
                                                {!quotaQuery.data ? "Inicie uma sessão para começar a conversar com o Frank! 😊" : "Envie uma mensagem para começar a conversar com o Frank! 😊"}
                                            </p>
                                        }
                                        <List
                                            bordered={false}
                                            dataSource={responseQuery.data}
                                        >
                                            {
                                                responseQuery?.data?.map(item => (
                                                    <>
                                                        <List.Item>
                                                            <ResponseText backgroundcolor='#373437'>
                                                                <UserIcon />
                                                                {item.input}
                                                            </ResponseText>
                                                        </List.Item>
                                                        <List.Item>
                                                            <ResponseText backgroundcolor='#555455'>
                                                                <div style={{ display: 'flex', width: '100%', height: '1rem', marginBottom: '0.5rem', flexDirection: 'row-reverse', marginRight: '30px' }}>
                                                                    <Button type='text' onClick={() => {
                                                                        setCurrentResponseId(item.responseId)
                                                                        setIsNegativeFeedbackModalOpen(true)
                                                                    }} icon={<DislikeOutlined />} style={{ color: '#f2b8be' }}></Button>
                                                                    <Button type='text' onClick={() => {
                                                                        setCurrentResponseId(item.responseId)
                                                                        setIsPositiveFeedbackModalOpen(true)
                                                                    }} icon={<LikeOutlined />} style={{ color: '#bff5c1' }}></Button>
                                                                </div>
                                                                <div style={{ width: '90%' }}>
                                                                    <FrankUserIcon src={logo} />
                                                                    <Linkify>
                                                                        {item.output}
                                                                    </Linkify>
                                                                </div>
                                                            </ResponseText>
                                                        </List.Item>
                                                    </>
                                                ))
                                            }
                                            {
                                                sendMessageMutation.isLoading
                                                &&
                                                <>
                                                    <List.Item>
                                                        <ResponseText backgroundcolor='#373437'>
                                                            <UserIcon />
                                                            {message}
                                                        </ResponseText>
                                                    </List.Item>
                                                    <List.Item>
                                                        <ResponseText backgroundcolor='#555455' style={{ display: 'flex', fontSize: '20px' }}>
                                                            <FrankUserIcon src={logo} />
                                                            <Typewriter
                                                                options={{
                                                                    strings: ['.......'],
                                                                    loop: true,
                                                                    autoStart: true,
                                                                    deleteSpeed: 50,
                                                                    skipAddStyles: true
                                                                }}
                                                            />
                                                        </ResponseText>
                                                    </List.Item>
                                                </>
                                            }
                                        </List>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: '40px' }}>
                                    <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Form form={form} style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }} onFinish={handleSendMessage} >
                                            <Form.Item name="message" noStyle={true}>
                                                <MessageTextArea
                                                    style={{ marginLeft: '0px' }}
                                                    ref={messageInputRef}
                                                    disabled={!quotaQuery.data}
                                                    onPressEnter={(e) => {
                                                        e.preventDefault()
                                                        form.submit()
                                                    }}
                                                />
                                            </Form.Item>
                                            <Button
                                                icon={<SendOutlined color='black' style={{ color: 'black' }} />}
                                                disabled={!quotaQuery.data}
                                                type='primary'
                                                htmlType='submit'
                                                loading={sendMessageMutation.isLoading || startSessionMutation.isLoading}
                                                onClick={handleSendMessage}
                                                style={{
                                                    backgroundColor: '#d9d6db',
                                                    width: '50px',
                                                    height: '80%',
                                                    marginLeft: '8px',
                                                }}
                                            >
                                            </Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </div>
                        </StyledContent>
                    </Col>
                    <PositiveFeedbackModal visible={isPositiveFeedbackModalOpen} setVisible={setIsPositiveFeedbackModalOpen} responseId={currentResponseId} />
                    <NegativeFeedbackModal visible={isNegativeFeedbackModalOpen} setVisible={setIsNegativeFeedbackModalOpen} responseId={currentResponseId} />
                </Row>
            </Spin>
        </>

    )
}