import { Col, Form, Input, Modal, Row, Select, notification } from "antd";
import { OkButtonModal } from "./FeedbackModal";
import styled from "styled-components";
import { SchoolMatter, SchoolMatterAsString } from "../enums/school-matter";
import { useQueryClient, useMutation } from "react-query";
import api from "../api/api";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface CommentModalProps {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    selectedStudentId: string,
    currentComment?: any
}

const MAX_CHARS_ON_COMMENT = 120

export default function CommentModal({ visible, setVisible, selectedStudentId, currentComment }: CommentModalProps) {
    const [form] = Form.useForm()

    const queryClient = useQueryClient()

    const [charsQuantityOnComment, setCharsQuantityOnComment] = useState<number>(0)

    const createOrUpdateCommentMutation = useMutation<{ comment: string, matter: SchoolMatter }>({
        mutationFn: async (values: any) => {
            const { comment, matter } = values as { comment: string, matter: SchoolMatter }
            if (!currentComment) {
                return await api.post(`/students/${selectedStudentId}/comment`, { comment, matter }, { headers: { "id": localStorage.getItem("id") } })
            }
            else {
                return await api.put(`/students/${selectedStudentId}/comment/${currentComment._id}`, { comment, matter }, { headers: { "id": localStorage.getItem("id") } })
            }
        },
        onSuccess: () => {
            notification.success({ message: !currentComment ? "Comentário criado com sucesso" : "Comentário editado com sucesso" })
            queryClient.invalidateQueries('comments')
            form.resetFields()
            setVisible(false)
        },
        onError: (_) => {
            notification.error({ message: 'Erro', description: 'Tente novamente mais tarde.' })
        }
    })

    const handleOnSubmit = async (values: any) => {
        createOrUpdateCommentMutation.mutateAsync({ ...values })
    }

    const handleCommentOnChange = (value: string) => {
        setCharsQuantityOnComment(value.length)
    }

    const bindForm = useCallback(() => {
        form.setFieldsValue({ comment: currentComment?.comment, matter: currentComment?.matter })
    }, [form, currentComment])

    useEffect(() => {
        bindForm()
        setCharsQuantityOnComment(currentComment?.comment?.length || 0)
    }, [bindForm])

    const options = useMemo(() => Object.entries(SchoolMatterAsString).map(([key, value]) => {
        return { label: value, value: Number.parseInt(key) }
    }), [])

    return (
        <Modal open={visible} closable={true} footer={<OkButtonModal
            onClick={() => form.submit()} loading={createOrUpdateCommentMutation.isLoading}>Comentar</OkButtonModal>} onCancel={() => setVisible(false)}>
            <p className="title" style={{ fontSize: '16px' }}>{!currentComment ? "Adicionar comentário" : 'Editar comentário'}</p>
            <Form form={form} style={{ marginTop: "20px" }} labelWrap={true} onFinish={handleOnSubmit} requiredMark={false}>
                <Row>
                    <Col span={12}></Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        {charsQuantityOnComment}/{MAX_CHARS_ON_COMMENT}
                    </Col>
                </Row>
                <Form.Item style={{}} name="comment" label="Comentário" rules={[{ required: true, message: 'É necessário informar algum comentário' }, {
                    validator: async (_, value) => {
                        if (value?.length > MAX_CHARS_ON_COMMENT) {
                            return Promise.reject(new Error(`O comentário não pode ter mais que ${MAX_CHARS_ON_COMMENT} caracteres`))
                        }
                    }
                }]}>
                    <Input.TextArea size="large" style={{ resize: "none" }} className="input" onChange={(event) => handleCommentOnChange(event.target.value)} />
                </Form.Item>
                <Form.Item label="Disciplina" name="matter" style={{ marginTop: "40px" }} rules={[{ required: true, message: 'É necessário informar o tipo da disciplina para o comentário' }]}>
                    <SelectStyled className={undefined} style={{ width: "60%", marginLeft: '16px', borderColor: 'none' }} options={options}></SelectStyled>
                </Form.Item>
            </Form>
        </Modal>
    )
}

const SelectStyled = styled(Select)`
&&{
    border-color: black;
}
&&:hover{
    outline: none;
    border-color: #d9d6db;
}
`