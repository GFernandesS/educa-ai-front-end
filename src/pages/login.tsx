import { Col, Form, Input, Layout, Row, notification } from "antd"
import { useEffect, useState } from "react"
import { useMutation } from "react-query"
import Header from '../components/FranqIAHeader'
import api from '../api/api'
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { LinkStyle } from "../style/LinkStyle"
import { ContentWithFrankImage } from "../components/ContentWithFrankImage"
import { HomeButtonStyle } from "../style/HomeButtonStyle"
import "../css/home.css"
import "../css/login.css"

export const Login = () => {
    const [contentHeight, setContentHeight] = useState(0)

    const navigate = useNavigate()

    const [form] = Form.useForm()

    const [hasNotFilledAditionalInfo, setHasNotFilledAditionalInfo] = useState<Boolean>(false)

    const [hasInvalidApiKey, setHasInvalidApiKey] = useState<any>(null)

    const [contextApiKey, setContextApiKey] = useState('')

    useEffect(() => {
        if (localStorage.getItem('apiKey'))
            navigate('/chat')

    }, [])

    const loginMutation = useMutation({
        mutationFn: async (apiKey: string): Promise<any> => {
            return await api.post('/api-key', {}, { headers: { "api-key": apiKey } })
        },
        onError: (error: AxiosError) => {
            setHasInvalidApiKey(true)
        },
        onSuccess: async (data, variables, _context) => {
            const hasNotFilledAdditionalInfo = !data.data.phoneFilled && !data.data.nameFilled
            setHasInvalidApiKey(false)
            setHasNotFilledAditionalInfo(hasNotFilledAdditionalInfo)

            if (!hasNotFilledAdditionalInfo) {
                localStorage.setItem('apiKey', variables)
                localStorage.setItem('username', data.data.name)
                navigate('/chat')
            }
            else
                setContextApiKey(variables)
        }
    })

    const additionalInfoApiKeyMutation = useMutation({
        mutationFn: async ({ apiKey, username, phoneNumber }: { apiKey: string, username: string, phoneNumber: string }) => {
            await api.post("/api-key/additional-info", { phone: phoneNumber, name: username, hasAcceptedTermsAndConditions: true }, { headers: { "api-key": apiKey } })
        },
        onSuccess: (_data, variables, _context) => {
            localStorage.setItem('apiKey', variables.apiKey)
            localStorage.setItem('username', variables.username)
            navigate('/chat')
        }
    })

    const handleApiKeyValidationStatus = () => {
        if (hasInvalidApiKey == null)
            return ''

        if (hasInvalidApiKey)
            return 'error'

        if (hasInvalidApiKey == false)
            return 'success'

        setHasInvalidApiKey(null)
    }

    const handleLogin = async ({ apiKey, username, phoneNumber }: { apiKey: string, username: string, phoneNumber: any }) => {
        console.log("caiu")
        if (!hasNotFilledAditionalInfo)
            await loginMutation.mutateAsync(apiKey)
        else {
            await additionalInfoApiKeyMutation.mutateAsync({ apiKey: contextApiKey, username, phoneNumber: phoneNumber })
        }
    }

    const handleTermsAndConditionsOnClick = () => {
        window.open("https://terms-and-conditions-franqia.s3.amazonaws.com/FranqIA-Termos-Condicoes.pdf")
    }

    return (
        <>
            <Header setContentHeight={setContentHeight} />
            <ContentWithFrankImage>
                <Row style={{ marginTop: '45px' }}>
                    <Col md={8} xs={2} />
                    <Col xs={22} md={8} style={{ display: 'flex', justifyContent: 'center', fontSize: '25px' }}>
                        {!hasNotFilledAditionalInfo ? "Para começar a testar, insira sua chave de ativação:" : "Agora, preencha seu nome e telefone."}
                    </Col>
                </Row>
                <Row style={{ marginTop: "45px" }}>
                    <Col md={8} xs={2} />
                    <Col xs={20} md={8} >
                        <Form form={form} className='form' onFinish={handleLogin}>
                            <Row>
                                <Col span={24}>
                                    {
                                        !hasNotFilledAditionalInfo ? (
                                            <>
                                                <p style={{ font: 'normal normal normal 18px/38px Poppins', marginBottom: '10px' }}> Chave de ativação</p>
                                                <Form.Item style={{ marginTop: '0px' }}
                                                    name="apiKey"
                                                    validateStatus={handleApiKeyValidationStatus()}
                                                    help={hasInvalidApiKey ? "Chave de ativação inválida" : ""}
                                                    rules={[{ required: true, message: 'É necessário informar uma chave' }]}>
                                                    <Input className="input" />
                                                </Form.Item>
                                            </>
                                        ) : (
                                            <>
                                                <span className="input-label">Nome</span>
                                                <Form.Item name="username" rules={[{ required: true, message: "É necessário informar o seu nome" }]}>
                                                    <Input className="input" />
                                                </Form.Item>
                                                <span className="input-label">Celular</span>
                                                <Form.Item name="phoneNumber" rules={[{
                                                    required: true,
                                                    validator: async (_, value) => {
                                                        if (!value)
                                                            return Promise.reject("É necessário informar o seu celular")
                                                    }
                                                }]}>
                                                    {<PhoneInput
                                                        inputClass="input"
                                                        placeholder="+55 (11) 99999-9999"
                                                        inputStyle={{ fontSize: "15px" }}
                                                        searchStyle={{ color: "black" }}
                                                        dropdownStyle={{ color: 'black', maxHeight: '10rem', maxWidth: '100%' }} />}
                                                </Form.Item>
                                                <p className="terms-and-conditions">Ao clicar em iniciar, você concorda com os termos de uso do FranqIA, que podem ser lidos <LinkStyle onClick={handleTermsAndConditionsOnClick}>aqui</LinkStyle>.</p>
                                            </>
                                        )
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <HomeButtonStyle style={{ marginTop: '1%' }} loading={loginMutation.isLoading} htmlType="submit" type="primary">Iniciar!</HomeButtonStyle>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </ContentWithFrankImage>
        </>
    )
}