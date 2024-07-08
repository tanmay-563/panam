import React, {useEffect, useState} from 'react'
import LogoIcon from "../../public/logo_light.svg";
import GithubIcon from "../../public/github.svg";
import AddIcon from "../../public/add.svg";
import RefreshIcon from "../../public/refresh.svg";
import SettingsIcon from "../../public/settings.svg";
import Add from "./Add";

const Navbar = ({onRefresh, onOpenAdd}) => {

    return (
        <div className="navbar">
            <div className="logoBox">
                <LogoIcon className="logo"/>
                <span>
                    Stonks
                </span>
            </div>
            <div className="icons">
                <AddIcon className="icon" onClick={()=>onOpenAdd(true)}/>
                <RefreshIcon className="icon" onClick={onRefresh}/>
                <GithubIcon className="icon"/>
                <SettingsIcon className="icon"/>
            </div>

        </div>
    )
}

export default Navbar