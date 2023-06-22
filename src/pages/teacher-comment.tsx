import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/EduIAHeader'
import { Button, Col, Divider, List, Row, Select, Tag, notification } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import api from '../api/api'
import { BookOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import CommentModal from '../components/CommentModal'
import { SchoolMatter, SchoolMatterAsString } from '../enums/school-matter'
import { v4 as uuidv4 } from 'uuid'
import styled from 'styled-components'
import { useAuthorization } from '../hooks/useAuthorization'

export default function TeacherComment() {
    const [contentHeight, setContentHeight] = useState(0)

    const navigate = useNavigate()

    const [studentOptions, setStudentOptions] = useState<{ id: string, name: string }[]>([])

    const queryClient = useQueryClient()

    const [selectedStudent, setSelectedStudent] = useState<string>("")

    const [commentModalVisible, setCommentModalVisible] = useState<boolean>(false)

    const [commentListVisible, setCommentListVisible] = useState<boolean>(false)

    const [currentComment, setCurrentComment] = useState<any>(null)

    const studentsIdentificationInfoQuery = useQuery('studentsIdentificationInfo', async () => {
        return await api.get('/students/identification-info', { headers: { id: localStorage.getItem('id') } })
    }, { refetchOnWindowFocus: false })

    const commentsQuery = useQuery('comments', async () => {
        return await api.get(`/students/${selectedStudent}/comments`, { headers: { id: localStorage.getItem('id') } })
    }, { refetchOnWindowFocus: false, enabled: commentListVisible })

    const deleteCommentMutation = useMutation({
        mutationFn: async (commentId: string) => {
            return await api.delete(`/students/${selectedStudent}/comment/${commentId}`, { headers: { id: localStorage.getItem('id') } })
        },
        onSuccess: () => {
            notification.success({ message: 'Comentário deletado com sucesso' })
        }
    })

    useAuthorization(true)

    useEffect(() => {
        if (!studentsIdentificationInfoQuery.data?.data || studentOptions.length > 0)
            return

        setStudentOptions(studentsIdentificationInfoQuery.data.data.map((student: any) => {
            return { value: student.id, label: `${student.name} - ${student.id}` }
        }))
    }, [studentsIdentificationInfoQuery])

    const handleOnSelect = (id: any) => {
        setSelectedStudent(id)
        setCommentListVisible(true)
    }

    const handleAddCommentOnClick = () => {
        setCurrentComment(null)
        setCommentModalVisible(true)
    }

    const handleDeleteCommentOnClick = async (commentId: string) => {
        await deleteCommentMutation.mutateAsync(commentId)
        queryClient.invalidateQueries('comments')
    }

    return (
        <>
            <Header hideMenu={true} setContentHeight={setContentHeight} isLogged={true} />
            <Row style={{ marginTop: "20px" }}>
                <Col md={8} xs={2} />
                <Col xs={22} md={8} className='title' style={{ textAlign: 'center' }}>
                    Comentários
                </Col>
                <Col span={8} xs={0} />
            </Row>
            <Row style={{ marginTop: '5px' }}>
                <Col md={6} xs={2} />
                <Col xs={22} md={12} className='text'>
                    Aqui você, professor, poderá inserir comentários sobre os alunos que ajudará o Edu a apoiá-los no dia a dia.
                </Col>
            </Row>
            <Row>
                <Col span={8}></Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                    <p style={{ font: 'normal normal normal 20px/38px Poppins', marginBottom: '10px' }}> Digite o nome ou R.A do aluno </p>
                </Col>
            </Row>
            <Row style={{ marginTop: '5px' }}>
                <Col span={8}></Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                    <Select onSelect={handleOnSelect} placeholder="Nome ou R.A" showSearch={true} size='large' style={{ width: '60%' }} options={studentOptions} filterOption={(input, option) => {
                        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) || (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    } />
                </Col>
            </Row>
            {commentListVisible &&
                <Row style={{ marginTop: '25px', textAlign: 'center', maxWidth: '100%' }}>
                    <Col span={6}></Col>
                    <Col span={12} style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <Divider orientation="left" type='horizontal'>Comentários prévios</Divider>
                        <Row style={{ marginBottom: "20px" }}>
                            <Col>
                                <AddCommentStyle onClick={handleAddCommentOnClick}>Adicionar comentário</AddCommentStyle>
                            </Col>
                        </Row>
                        <List bordered={true}>
                            {
                                commentsQuery.data?.data.map((commentData: any) => {
                                    return (
                                        <List.Item style={{ lineBreak: "anywhere" }} key={uuidv4()}>
                                            <Row style={{ marginBottom: '15px', marginRight: '20px' }}>
                                                <Button type='text' onClick={() => {
                                                    setCommentModalVisible(true)
                                                    setCurrentComment(commentData)
                                                }} icon={<EditOutlined />} style={{ color: 'rgb(41, 46, 41)' }} />
                                                <Button type='text' onClick={async () => {
                                                    console.log('comment', commentData)
                                                    await handleDeleteCommentOnClick(commentData._id)
                                                }} icon={<DeleteOutlined />} style={{ color: 'rgb(41, 46, 41)' }} />
                                            </Row>
                                            {commentData.comment}
                                            <Row style={{ marginTop: '15px' }}><Tag color="#edc7ed" icon={<BookOutlined />}>{SchoolMatterAsString[commentData.matter as SchoolMatter]}</Tag></Row>
                                        </List.Item>
                                    )
                                })
                            }
                        </List>
                    </Col>
                </Row>
            }
            <CommentModal visible={commentModalVisible} setVisible={setCommentModalVisible} selectedStudentId={selectedStudent} currentComment={currentComment} />
        </>
    )
}

const AddCommentStyle = styled(Button)`
&&:hover{
    color: #B57BB5;
    border-color: #B57BB5;
}
`