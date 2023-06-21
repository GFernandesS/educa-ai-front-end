import { Form, Modal, Input, Button, notification } from "antd"
import { LikeFilled, DislikeFilled } from "@ant-design/icons"
import styled from "styled-components"
import { useMutation } from "react-query"
import api from '../api/api'
import { FeedbackType } from "../enums/feedback-type-enum"
import { FormInstance } from "rc-field-form"

const { TextArea } = Input

export interface FeedbackModalProps {
    visible: boolean,
    setVisible: (value: boolean) => void,
    responseId: string
}

const getSendFeedbackMutation = (feedbackType: FeedbackType, form: FormInstance<any>, setVisible: (value: boolean) => void, responseId: string) => useMutation({
    mutationFn: async (feedback: string) => {
        await api.post('/feedback', { type: feedbackType, feedback, responseId })
    },
    onSuccess: () => {
        form.resetFields()
        setVisible(false)
    },
    onError: () => {
        notification.error({ message: 'Erro ao enviar o feedback', description: 'Tente novamente mais tarde.' })
    }
})

export const PositiveFeedbackModal = ({ visible, setVisible, responseId }: FeedbackModalProps) => {
    const [form] = Form.useForm()

    const handleOnOk = async (values: any) => {
        await sendFeedbackMutation.mutateAsync(values.feedback)
    }

    const handleOnCancel = () => {
        if (!sendFeedbackMutation.isLoading) {
            form.resetFields()
            setVisible(false)
        }
    }

    const sendFeedbackMutation = getSendFeedbackMutation(FeedbackType.POSITIVE, form, setVisible, responseId)

    return (
        <FeedbackModalStyled open={visible} closable={true} onCancel={handleOnCancel} footer={<OkButtonFeedback loading={sendFeedbackMutation.isLoading}
            onClick={() => form.submit()}>Enviar feedback</OkButtonFeedback>}>

            <LikeFilled style={{ fontSize: '25px', color: '#91ed95' }} />
            <p>Que bom que gostou dessa minha resposta! 😊</p>
            <p>Descreva como essa resposta foi útil para você: </p>

            <Form form={form} onFinish={async (values) => await handleOnOk(values)}>
                <Form.Item name='feedback'>
                    <TextAreaFeedback placeholder="O detalhamento do feedback é opcional" size="large" style={{ resize: 'none', outline: 'none' }} />
                </Form.Item>
            </Form>

        </FeedbackModalStyled>
    )
}

export const NegativeFeedbackModal = ({ visible, setVisible, responseId }: FeedbackModalProps) => {
    const [form] = Form.useForm()

    const sendFeedbackMutation = getSendFeedbackMutation(FeedbackType.NEGATIVE, form, setVisible, responseId)

    const handleOnOk = async (values: any) => {
        await sendFeedbackMutation.mutateAsync(values.feedback)
    }

    const handleOnCancel = () => {
        if (!sendFeedbackMutation.isLoading) {
            form.resetFields()
            setVisible(false)
        }
    }

    return (
        <FeedbackModalStyled open={visible} closable={true} onCancel={handleOnCancel} footer={<OkButtonFeedback loading={sendFeedbackMutation.isLoading}
            onClick={() => form.submit()}>Enviar feedback</OkButtonFeedback>}>

            <DislikeFilled style={{ fontSize: '25px', color: '#ff4d4f' }} />
            <p>Que pena que não respondi o que você precisava... 😔</p>
            <p>Descreva como essa resposta poderia ter sido melhor: </p>

            <Form form={form} onFinish={async (values) => await handleOnOk(values)}>
                <Form.Item name='feedback'>
                    <TextAreaFeedback placeholder="O detalhamento do feedback é opcional" size="large" style={{ resize: 'none', outline: 'none' }} />
                </Form.Item>
            </Form>

        </FeedbackModalStyled>
    )
}

const TextAreaFeedback = styled(TextArea)`
    &&{
        outline: none;
        resize: none;
        border-color: #d9d6db;
    }

    &&:hover{
        outline: none;
        border-color: #d9d6db;
    }

    &&:focus{
        outline: none;
        border-color: #d9d6db;
    }
`

const OkButtonFeedback = styled(Button)`
    &&:hover{
        outline: none;
        border-color: #d9d6db;
        color: #b1afb3;
        box-sizing: border-box;
    }

    &&:focus{
        outline: none;
        border-color: #b1afb3;
        box-sizing: border-box;
    }
`

const FeedbackModalStyled = styled(Modal)`
    &&{
        font-weight: bold;
    }
`