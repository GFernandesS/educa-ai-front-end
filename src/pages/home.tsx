import { useState } from 'react'
import { FC } from 'react'
import { Col, Row } from 'antd'
import Header from '../components/FranqIAHeader'
import { useNavigate } from 'react-router-dom'
import '../css/home.css'
import { ContentWithFrankImage } from '../components/ContentWithFrankImage'
import { HomeButtonStyle } from '../style/HomeButtonStyle'

interface IHome { }

const Home: FC<IHome> = ({ }) => {
   const navigate = useNavigate()

   const [contentHeight, setContentHeight] = useState(0)

   return (
      <>
         <Header setContentHeight={setContentHeight} />
         <ContentWithFrankImage >
            <Row style={{ marginTop: "50px" }}>
               <Col md={8} xs={2} />
               <Col xs={22} md={8} className='title'>
                  Olá, Seja bem-vindo!
               </Col>
               <Col span={8} xs={0} />
            </Row>
            <Row style={{ marginTop: '5px' }}>
               <Col md={8} xs={2} />
               <Col xs={22} md={8} className='text'>
                  A DataMotica disponibiliza FranqIA, uma ferramenta de Inteligência Artificial especializada em franquias e negócios.
               </Col>
            </Row>
            <Row>
               <Col md={8} xs={2} />
               <Col xs={22} md={8} className='text' style={{ marginTop: '3%' }}>
                  Frank, nosso assistente virtual, ainda não é perfeito, está aprendendo e dando seus primeiros passos.
               </Col>
            </Row>
            <Row style={{ marginTop: '50px' }}>
               <Col md={8} xs={2} />
               <Col xs={20} md={8} className='text-button text'>
                  <HomeButtonStyle onClick={() => navigate('/login')}>Testar consultor de franquias</HomeButtonStyle>
               </Col>
            </Row>
         </ContentWithFrankImage>
      </>
   )
}

export default Home
