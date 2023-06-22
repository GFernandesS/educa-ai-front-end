import { Row, Col, Button, List, notification, Spin, Form, Tooltip, message as messageAntd } from 'antd'
import Header from '../components/EduIAHeader'
import { useEffect, useRef, useState } from 'react'
import { SendOutlined, LikeOutlined, DislikeOutlined, CopyOutlined } from '@ant-design/icons'
import { StyledContent } from '../style/ContentStyle'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../api/api'
import { EduUserIcon } from '../style/EduUserIcon'
import logo from '../assets/edu.png'
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
import { UserRole } from '../enums/user-role'
import { useAuthorization } from '../hooks/useAuthorization'

export const Chat = () => {
    const [contentHeight, setContentHeight] = useState(0)

    const [message, setMessage] = useState('')

    useAuthorization(true)

    const [isPositiveFeedbackModalOpen, setIsPositiveFeedbackModalOpen] = useState(false)

    const [isNegativeFeedbackModalOpen, setIsNegativeFeedbackModalOpen] = useState(false)

    const [currentResponseId, setCurrentResponseId] = useState('')

    const messageInputRef = useRef<any>()

    const [isMenuVisible, setIsMenuVisible] = useState(true)

    const responsesScroll = useRef<any>()

    const queryClient = useQueryClient()

    const [form] = Form.useForm()

    const [messageApi, contextHolder] = messageAntd.useMessage();

    const invalidateQueries = () => {
        queryClient.invalidateQueries('responses')
        queryClient.invalidateQueries('quota')
        queryClient.invalidateQueries('count-available')
    }

    const responseQuery = useQuery<[{ input: string, output: string, responseId: string }]>('responses', async () => {
        if (localStorage.getItem('id')) {
            const response = await api.get('/chat/responses', { headers: { "id": localStorage.getItem('id') } })
            return response.data
        }
    }, { refetchOnWindowFocus: false })

    const sendMessageMutation = useMutation({
        mutationFn: async (message: string) => {
            await api.post('/chat', { message }, { headers: { "id": localStorage.getItem('id') } })
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

    useEffect(() => {
        if (isMenuVisible)
            setIsMenuVisible(false)
    }, [sendMessageMutation?.isLoading])

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
            {contextHolder}
            <Header onClickMenu={handleSetIsMenuVisible} setContentHeight={setContentHeight} isLogged={true} />
            <Spin size='large' indicator={<LoadingSpin />} spinning={responseQuery.isLoading}>
                <Row>
                    <Col md={24}>
                        <StyledContent hasbackgroundcolor={false} contentheight={contentHeight}>
                            <div style={{ maxHeight: '100%', height: '100%', backgroundColor: '#373437', width: '100%' }}>
                                <Row ref={responsesScroll} justify='center' align='top' style={{ height: '80%', backgroundColor: '#373437', overflow: 'auto' }}>
                                    <Col span={24} style={{ paddingTop: '5rem', textAlign: 'left' }}>
                                        {
                                            !responseQuery?.data?.length && !sendMessageMutation.isLoading &&
                                            <p style={{ fontSize: '17px', color: 'white', display: 'flex', justifyContent: 'center' }}>
                                                {"Envie uma mensagem para começar a conversar com o Edu! 😊"}
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
                                                                    <Tooltip title="Copiar mensagem">
                                                                        <Button type='text' onClick={async () => {
                                                                            await navigator.clipboard.writeText(item.output)
                                                                            messageApi.success("Resposta copiada para a área de transferência")
                                                                        }} icon={<CopyOutlined />} style={{ color: '#c8cac8' }}></Button>
                                                                    </Tooltip>
                                                                </div>
                                                                <div style={{ width: '90%' }}>
                                                                    <EduUserIcon src={logo} />
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
                                                            <EduUserIcon src={logo} />
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
                                                    onPressEnter={(e) => {
                                                        e.preventDefault()
                                                        form.submit()
                                                    }}
                                                />
                                            </Form.Item>
                                            <Button
                                                icon={<SendOutlined color='black' style={{ color: 'black' }} />}
                                                type='primary'
                                                htmlType='submit'
                                                loading={sendMessageMutation.isLoading}
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