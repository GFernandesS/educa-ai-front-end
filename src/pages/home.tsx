import { useState } from 'react'
import { FC } from 'react'
import { Col, Row } from 'antd'
import Header from '../components/EduIAHeader'
import { useNavigate } from 'react-router-dom'
import '../css/home.css'
import { ContentWithEduImage } from '../components/ContentWithEduImage'
import { HomeButtonStyle } from '../style/HomeButtonStyle'

interface IHome { }

const Home: FC<IHome> = ({ }) => {
   const navigate = useNavigate()

   const [contentHeight, setContentHeight] = useState(0)

   return (
      <>
         <Header setContentHeight={setContentHeight} />
         <ContentWithEduImage >
            <Row style={{ marginTop: "50px" }}>
               <Col md={8} xs={2} />
               <Col xs={22} md={8} className='title'>
                  Olá estudante! Seja bem-vindo!
               </Col>
               <Col span={8} xs={0} />
            </Row>
            <Row style={{ marginTop: '5px' }}>
               <Col md={8} xs={2} />
               <Col xs={22} md={8} className='text'>
                  Aqui você conhecerá o Edu, uma inteligência artificial especialista em educação que te ajudará nas matérias do dia a dia.
               </Col>
            </Row>
            <Row>
               <Col md={8} xs={2} />
               <Col xs={22} md={8} className='text' style={{ marginTop: '3%' }}>
                  Ele tirará suas dúvidas e vai te apoiar no que deseja se tornar.
               </Col>
            </Row>
            <Row style={{ marginTop: '50px' }}>
               <Col md={8} xs={2} />
               <Col xs={20} md={8} className='text-button text'>
                  <HomeButtonStyle onClick={() => navigate('/login')}>Bora lá!</HomeButtonStyle>
               </Col>
            </Row>
         </ContentWithEduImage>
      </>
   )
}

export default Home
