import {useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {iconMap} from "./icons/Icons";

const Settings = ({   data,
                      showSettings,
                      setShowSettings
}) => {
    const sheetMetadata = data?.metadata?.sheet;
    let sheetUrl = "";
    try{
        sheetUrl = sheetMetadata.filter((item) => item.Key.toLowerCase() == "sheeturl")[0].Value
    }
    catch (e){}
    const settingsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            let settingsIconElement = document.getElementById("settings-icon");
            if (settingsRef.current && !settingsRef.current.contains(event.target)
                && !settingsIconElement.contains(event.target)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    return (
        <div className={`settings-container ${showSettings ? 'show': 'hide'}`} ref={settingsRef}>
            <div className="settings-content">
                <div className="settings-lineitem" onClick={()=> {
                    setShowSettings(!showSettings);
                    window.open(sheetUrl, "_blank");
                }}>
                    {iconMap["_link"]}
                    <div className="settings-label">
                        Open sheets
                    </div>
                </div>
                <Link
                    to="add/instrument"
                >
                    <div className="settings-lineitem" onClick={()=>setShowSettings(!showSettings)}>
                        {iconMap["_postadd"]}
                        <div className="settings-label">
                            Add Instrument
                        </div>
                    </div>
                </Link>
                <Link
                    to="delete/instrument"
                >
                    <div className="settings-lineitem" onClick={()=>setShowSettings(!showSettings)}>
                        {iconMap["_delete"]}
                            <div className="settings-label">
                                Delete Instrument
                            </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Settings