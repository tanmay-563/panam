import LogoIcon from "../../public/logo_light.svg";
import AddIcon from "../../public/add.svg";
import RefreshIcon from "../../public/refresh.svg";
import SettingsIcon from "../../public/settings.svg";
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({   onRefresh,
                    openAdd,
                    onOpenAdd,
                    showSettings,
                    onShowSettings,
                    setHamburgerToggle}) => {

    return (
        <div className="navbar" onClick={() => {
            if(openAdd)
                onOpenAdd(false)
            if(showSettings)
                onShowSettings(false)
        }}>
            <div className="logo-box">
                <LogoIcon className="logo"/>
                <span>
                    Panam
                </span>
            </div>
            <div className="hamburger" onClick={() => {
                setHamburgerToggle()
            }}
            >
                <MenuIcon/>
            </div>
            <div className="icons">
                <AddIcon className="icon" onClick={()=> onOpenAdd(true)}/>
                <RefreshIcon className="icon" onClick={()=> onRefresh()}/>
                <SettingsIcon className="icon" onClick={()=> onShowSettings(true)}/>
            </div>

        </div>
    )
}

export default Navbar