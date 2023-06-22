import { useEffect, useRef } from 'react'
import { Layout, Row, Col } from 'antd'
import logo from '../assets/edu.png'
import '../css/logo.css'
import { UserOutlined, DeleteRowOutlined, PicLeftOutlined } from '@ant-design/icons'
import '../css/header.css'
import { useNavigate } from 'react-router-dom'

const { Header } = Layout

interface IEduIAHeaderProps {
   setContentHeight: (height: number) => void,
   isLogged?: boolean,
   onClickMenu?: () => void
}

export default function EduIAHeader({ setContentHeight, isLogged, onClickMenu }: IEduIAHeaderProps) {

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
      localStorage.removeItem('name')
      localStorage.removeItem('id')
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
                  alt="EducaAi"
                  style={{
                     height: '60px',
                     marginLeft: '25px',
                     marginBottom: '15px'
                  }}
               />
               <span style={{ font: 'normal normal 500 25px/46px Poppins', marginLeft: "10px" }}>
                  EducaAi
               </span>
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
                           {localStorage.getItem('name')}
                        </p>
                        <DeleteRowOutlined className='exit-icon' onClick={handleLogoutOnClick} />
                     </>
                  )
               }
            </Col>
         </Row>
      </Header>
   )
}
