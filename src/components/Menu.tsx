import React, {useEffect, useRef, useState} from 'react'
import {Link} from "react-router-dom";
import {menu} from "../listData"
import DynamicIcons from "./DynamicIcons";
import {getDisplayName} from "../utils/common";
const Menu = ({
                  instruments,
                  metadata,
                  selectedMenuItem,
                  handleMenuClick,
                hamburgerToggle}
) => {
    const instrumentMetadata = metadata?.instrument || {};
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                event.target.getAttribute('data-testid') != "MenuIcon") {
                handleMenuClick(selectedMenuItem);
            }
        };

        if(hamburgerToggle)
            document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [hamburgerToggle])

    return (
        <div className={`menu-container ${hamburgerToggle ? 'expand': 'collapse'}`}>
            <div className="menu" ref={menuRef}>
                {menu.map((item) => (
                    <div className="item" key={item.id}>
                        <span className="title">{item.title}</span>
                        {item.listItems.map((listItem) => (
                            <Link
                                to={listItem.url}
                                className={`listItem ${selectedMenuItem === listItem ? 'selected' : ''}`}
                                key={listItem.id}
                                onClick={() => {handleMenuClick(listItem);}}
                                title={listItem.title}>
                                <DynamicIcons name={listItem.icon}></DynamicIcons>
                                <span className="listItemTitle">{listItem.title}</span>
                            </Link>
                        ))}
                    </div>
                ))}
                <div className="item">
                    <span className="title">Instruments</span>
                    {instruments?.map((listItem, index) => (
                        <Link
                            to={`/transactions/${listItem}`}
                            key={listItem}
                            className={`listItem ${selectedMenuItem === listItem ? 'selected' : ''}`}
                            onClick={() => handleMenuClick(listItem)}>
                            <DynamicIcons name={listItem}></DynamicIcons>
                            <span className="listItemTitle">{getDisplayName(instrumentMetadata, listItem)}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Menu