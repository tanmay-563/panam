import React, {useEffect, useRef, useState} from 'react'
import {Link} from "react-router-dom";
import {menu} from "../listData"
import DynamicIcons from "./icons/DynamicIcons";
import {convertToJson} from "../utils/common";

const Menu = ({
                  instruments,
                  metadata,
                  selectedMenuItem,
                  handleMenuClick,
                hamburgerToggle}
) => {
    const instrumentMetadata = metadata?.instrument || {};
    const menuRef = useRef(null);
    const instrumentsMetadataJson = convertToJson(instrumentMetadata)

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
                {menu && menu.map((item) => (
                    <div className="item" key={item.id}>
                        <span className="title">{item.title}</span>
                        {item.listItems && item.listItems.map((listItem) => (
                            <Link
                                to={listItem.url}
                                className={`listItem ${selectedMenuItem === listItem ? 'selected' : ''}`}
                                key={listItem.id}
                                onClick={() => {handleMenuClick(listItem);}}
                                title={listItem.title}>
                                <DynamicIcons name={listItem.icon} className="menu-icon"></DynamicIcons>
                                <span className="listItemTitle">{listItem.title}</span>
                            </Link>
                        ))}
                    </div>
                ))}
                <div className="item">
                    <span className="title">Instruments</span>
                    {instruments?.map((listItem, _) => (
                        <Link
                            to={`/transactions/${listItem}`}
                            key={listItem}
                            className={`listItem ${selectedMenuItem === listItem ? 'selected' : ''}`}
                            onClick={() => handleMenuClick(listItem)}
                            title={instrumentsMetadataJson[listItem] ? instrumentsMetadataJson[listItem]["Label"] : listItem}>
                            <DynamicIcons name={instrumentsMetadataJson[listItem] ? instrumentsMetadataJson[listItem]["Icon"]: ""} className="menu-icon"></DynamicIcons>
                            <span className="listItemTitle">{instrumentsMetadataJson[listItem] ? instrumentsMetadataJson[listItem]["Label"] : listItem}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Menu