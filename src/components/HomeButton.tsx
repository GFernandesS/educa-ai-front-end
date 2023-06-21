import { Button } from 'antd'
import { HomeButtonStyle } from '../style/HomeButtonStyle'

interface IHomeButtonProps {
   onClick: () => void
}

const HomeButton = ({ onClick }: IHomeButtonProps) => {
   return (
      <HomeButtonStyle
         onClick={onClick}
      >
         Testar consultor de franquias
      </HomeButtonStyle>
   )
}

export default HomeButton
