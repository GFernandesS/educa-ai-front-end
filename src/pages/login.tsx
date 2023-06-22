import { Col, Form, Input, Row, notification } from "antd"
import { useEffect, useState } from "react"
import { useMutation } from "react-query"
import Header from '../components/EduIAHeader'
import api from '../api/api'
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import 'react-phone-input-2/lib/style.css'
import { ContentWithEduImage } from "../components/ContentWithEduImage"
import { HomeButtonStyle } from "../style/HomeButtonStyle"
import "../css/home.css"
import "../css/login.css"
import { UserRole } from "../enums/user-role"

export const Login = () => {
    const [contentHeight, setContentHeight] = useState(0)

    const navigate = useNavigate()

    const [form] = Form.useForm()

    useEffect(() => {
        if (localStorage.getItem('id'))
            navigate('/chat')
    }, [])

    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string, password: string }): Promise<any> => {
            return await api.post('/login', {}, { headers: { email, password } })
        },
        onError: (error: AxiosError) => {
            if (error.response?.status == 401)
                notification.error({ message: (error.response?.data! as { message: string, statusCode: number }).message })
            else
                notification.error({ message: "Erro ao realizar login. Tente novamente..." })
        },
        onSuccess: async (data, variables, context) => {
            localStorage.setItem('name', data.data.name)
            localStorage.setItem('id', data.data.id)
            if (data.data.role == UserRole.Student)
                navigate("/chat")
            else
                navigate("/teacher")
        }
    })

    const handleLogin = async ({ email, password }: { email: string, password: any }) => {
        await loginMutation.mutateAsync({ email, password })
    }

    return (
        <>
            <Header setContentHeight={setContentHeight} />
            <ContentWithEduImage>
                <Row style={{ marginTop: '45px' }}>
                    <Col md={8} xs={2} />
                    <Col xs={22} md={8} style={{ display: 'flex', justifyContent: 'center', fontSize: '25px' }}>
                        {"Utilize as credenciais geradas pela instituição para continuar:"}
                    </Col>
                </Row>
                <Row style={{ marginTop: "45px" }}>
                    <Col md={8} xs={2} />
                    <Col xs={20} md={8} >
                        <Form form={form} className='form' onFinish={handleLogin}>
                            <Row>
                                <Col span={24}>
                                    <>
                                        <p style={{ font: 'normal normal normal 18px/38px Poppins', marginBottom: '10px' }}> E-mail </p>
                                        <Form.Item style={{ marginTop: '0px' }}
                                            name="email"
                                            rules={[{ required: true, message: 'O email é obrigatório' }]}>
                                            <Input className="input" />
                                        </Form.Item>
                                        <p style={{ font: 'normal normal normal 18px/38px Poppins', marginBottom: '10px' }}> Senha</p>
                                        <Form.Item style={{ marginTop: '0px' }}
                                            name="password"
                                            rules={[{ required: true, message: 'A senha é obrigatória' }]}>
                                            <Input.Password className="input" />
                                        </Form.Item>
                                    </>

                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <HomeButtonStyle style={{ marginTop: '1%' }} loading={loginMutation.isLoading} htmlType="submit" type="primary">Entrar!</HomeButtonStyle>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </ContentWithEduImage>
        </>
    )
}