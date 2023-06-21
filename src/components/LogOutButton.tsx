import { LogoutOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export interface LogOutButtonProps {
    onClick: () => void,
}

export const LogOutButton = ({ onClick }: LogOutButtonProps) => {
    return <Button size='middle' type='primary' icon={<LogoutOutlined />} onClick={onClick} style={{
        fontSize: '17px',
        color: 'black',
        width: '50%',
        backgroundColor: '#d9d6db'
    }} >Sair</Button>
}