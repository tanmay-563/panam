import React from 'react'
const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo">
                <img src="/logo_light.svg" alt=""/>
                <span>
                    Stonks
                </span>
            </div>
            <div className="icons">
                <img src="/search.svg" alt="search" className="icon"/>
                <img src="/github.svg" alt="" className="icon"/>
                <img src="/settings.svg" alt="" className="icon"/>
            </div>

        </div>
    )
}

export default Navbar