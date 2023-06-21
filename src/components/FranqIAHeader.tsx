import { useEffect, useRef } from 'react'
import { Layout, Row, Col } from 'antd'
import logo from '../assets/franqia_logo.png'
import '../css/logo.css'
import { UserOutlined, DeleteRowOutlined, PicLeftOutlined } from '@ant-design/icons'
import '../css/header.css'
import { useNavigate } from 'react-router-dom'

const { Header } = Layout

interface IFranqIAHeaderProps {
   setContentHeight: (height: number) => void,
   isLogged?: boolean,
   onClickMenu?: () => void
}

export default function FranqIAHeader({ setContentHeight, isLogged, onClickMenu }: IFranqIAHeaderProps) {

   const headerRef = useRef<HTMLElement>(null)

   const navigate = useNavigate()

   useEffect(() => {
      function handleResize() {
         const headerHeight = headerRef.current!.offsetHeight
         const contentHeight = window.innerHeight - headerHeight
         setContentHeight(contentHeight)
      }

      handleResize()

      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
   }, [])

   const handleLogoutOnClick = () => {
      localStorage.removeItem('apiKey')
      localStorage.removeItem('username')
      navigate('/')
   }

   return (
      <Header
         ref={headerRef}
         style={{ height: '62px', backgroundColor: '#B57BB5', color: 'white', padding: '0' }}
      >
         <Row style={{ width: '100%', padding: '0', margin: '0' }}>
            <Col
               span={12}
               style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-start',
               }}
            >
               {isLogged && <PicLeftOutlined className='menu-icon' onClick={onClickMenu} />}
               <img
                  className='logo'
                  src={logo}
                  alt="FranqIA"
                  onClick={() => window.open("https://www.datamotica.com/")}
                  style={{
                     height: '93px',
                     marginLeft: '32px',
                     marginBottom: '15px'
                  }}
               />
            </Col>
            <Col span={12} style={{
               display: 'flex',
               height: '100%',
               alignItems: 'center',
               justifyContent: 'flex-end',
            }} >
               {
                  isLogged &&
                  (
                     <>
                        <UserOutlined style={{ marginRight: '10px', fontSize: 20 }} />
                        <p style={{ marginRight: '32px', marginBottom: '20px', font: 'normal normal normal 20px/30px Segoe UI' }}>
                           {localStorage.getItem('username')}
                        </p>
                        <DeleteRowOutlined className='exit-icon' onClick={handleLogoutOnClick} />
                     </>
                  )
                  ||
                  (
                     <p style={{ marginRight: '32px', font: 'normal normal normal 20px/30px Segoe UI' }}>
                        VERSÃO BETA
                     </p>
                  )
               }
            </Col>
         </Row>
      </Header>
   )
}
