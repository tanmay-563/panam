import {useEffect, useRef} from "react";
import SettingsIcon from "../../public/settings.svg";
import ExternalLinkIcon from "../../public/external_link.svg";

const Settings = ({   data,
                      showSettings,
                      setShowSettings
}) => {
    const sheetMetadata = data?.metadata?.sheetMetadata;
    let sheetUrl = "";
    try{
        sheetUrl = sheetMetadata.filter((item) => item.name = "sheetUrl")[0].value
    }
    catch (e){}
    const settingsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target) ) {
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
            <div className="settings-top-box">
                <SettingsIcon/>
                <div className="back" onClick={() => setShowSettings(!showSettings)}>
                    &rarr;
                </div>
            </div>
            <div className="settings-content">
                <div onClick={() => window.open(sheetUrl, "_blank")} className="sheets-link">
                    Go to sheets
                    <ExternalLinkIcon className="sheets-link-icon"/>
                </div>
            </div>
        </div>
    )
}

export default Settings