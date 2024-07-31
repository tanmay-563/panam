import LogoIcon from "../../public/logo_light.svg";
import AddIcon from "../../public/add.svg";
import RefreshIcon from "../../public/refresh.svg";
import SettingsIcon from "../../public/settings.svg";
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({   onRefresh,
                    dialogType,
                    setDialogType,
                    showSettings,
                    onShowSettings,
                    setHamburgerToggle}) => {

    return (
        <div className="navbar" onClick={() => {
            if(dialogType)
                setDialogType('')
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
                setHamburgerToggle()}}
            >
                <MenuIcon/>
            </div>
            <div className="icons">
                <div title="Add Transaction">
                    <AddIcon className="icon" onClick={()=> setDialogType('addTransaction')}/>
                </div>
                <div title="Refresh data">
                    <RefreshIcon className="icon" onClick={()=> onRefresh()}/>
                </div>
                <div id="settings-icon" title="Settings">
                    <SettingsIcon className="icon" onClick={()=> {
                        onShowSettings(!showSettings)
                    }}/>
                </div>
            </div>

        </div>
    )
}

export default Navbar