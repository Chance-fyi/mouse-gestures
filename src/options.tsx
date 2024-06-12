import "./style.css"
import image from "data-base64:assets/mousegt.png"
import type {Config} from "~config";
import {DefaultConfig, getConfig, setConfig} from "~config";
import {Fragment, useEffect, useState} from "react";
import {Direction, Operations} from "~enum";
import Alert from "~components/alert";

const IndexOptions = () => {
  const [cfg, setCfg] = useState<Config>(null);
  const [alerts, setAlerts] = useState([]);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    getConfig().then((config) => {
      setCfg(config);
    })
  }, []);

  const handleArrowsChange = (e) => {
    const {name, value} = e.target;
    setUpdated(true);
    setCfg({
      ...cfg,
      arrows: {
        ...cfg.arrows,
        [name]: value
      }
    });
  };

  const saveConfig = () => {
    setConfig(cfg);
    if (updated) {
      addAlert();
      setUpdated(false);
    }
  };

  const handleGesturesChange = (e) => {
    const {name, value} = e.target;
    const c = {
      ...cfg,
      gestures: {
        ...cfg.gestures,
        [name]: value
      }
    };
    setCfg(c);
    setConfig(c);
    addAlert();
  };

  const handleEnableGestureCueChange = (e) => {
    const c = {
      ...cfg,
      enableGestureCue: e.target.checked,
    };
    setCfg(c);
    setConfig(c);
    addAlert();
  };

  const handleStrokeStyleChange = (e) => {
    const c = {
      ...cfg,
      strokeStyle: e.target.value,
    };
    setUpdated(true);
    setCfg(c);
  };

  const handleLineWidthChange = (e) => {
    const c = {
      ...cfg,
      lineWidth: e.target.value,
    };
    setUpdated(true);
    setCfg(c);
    setConfig(c);
  };

  const resetConfig = () => {
    setCfg(DefaultConfig);
    setConfig(DefaultConfig);
    addAlert();
  }

  const addAlert = () => {
    const id = Math.random().toString(36).substring(2, 9);
    setAlerts([...alerts, {id, message: chrome.i18n.getMessage("changesHaveBeenImplemented"), duration: 2000}]);
  };

  const removeAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (<>
    <div className="toast toast-top toast-center w-16">
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          message={alert.message}
          duration={alert.duration}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
    {cfg && <div className="flex h-screen pt-10">
        <div className="w-1/2 p-4">
            <table className="w-full">
                <thead>
                <tr>
                    <th className="border p-4 w-1/12">{chrome.i18n.getMessage("gestures")}</th>
                    <th className="border p-4 w-1/6">{chrome.i18n.getMessage("icons")}</th>
                    <th className="border p-4 w-1/4">{chrome.i18n.getMessage("actions")}</th>
                    <th className="border p-4 w-1/12">{chrome.i18n.getMessage("gestures")}</th>
                    <th className="border p-4 w-1/6">{chrome.i18n.getMessage("icons")}</th>
                    <th className="border p-4 w-1/4">{chrome.i18n.getMessage("actions")}</th>
                </tr>
                </thead>
                <tbody>
                {
                  Object.values(Direction).reduce((rows, item, index) => {
                    if (index % 2 === 0) {
                      rows.push([item]);
                    } else {
                      rows[rows.length - 1].push(item);
                    }
                    return rows;
                  }, []).map((row, k) => {
                    return (
                      <tr key={k}>
                        {
                          row.map((item, k) => {
                            return (<Fragment key={k}>
                              <td className="border p-4 text-center">
                                <div style={{backgroundImage: `url(${image})`}}
                                     className={`icon icon-${item} scale-125`}></div>
                              </td>
                              <td className="border p-4">
                                <input type="text" className="input input-bordered w-full max-w-xs input-sm"
                                       name={Direction[item]}
                                       value={cfg.arrows[item]}
                                       onChange={handleArrowsChange}
                                       onBlur={saveConfig}/>
                              </td>
                              <td className="border p-4">
                                <select className="select select-bordered w-full max-w-xs select-sm"
                                        name={Direction[item]}
                                        value={cfg.gestures[item]}
                                        onChange={handleGesturesChange}>
                                  {Object.values(Operations).map(value => {
                                    return (<option key={value} value={value}>{chrome.i18n.getMessage(value)}</option>)
                                  })}
                                </select>
                              </td>
                            </Fragment>)
                          })
                        }
                      </tr>
                    );
                  })
                }
                </tbody>
            </table>
        </div>
        <div className="w-1/2 p-4 shadow-md text-base">
            <div className="flex justify-start items-center">
                <label className="mr-2"
                       htmlFor="enableGestureCue">{chrome.i18n.getMessage("enableMouseGestureHints")}:</label>
                <label className="swap text-lg">
                    <input type="checkbox"
                           id="enableGestureCue"
                           checked={cfg.enableGestureCue}
                           onChange={handleEnableGestureCueChange}/>
                    <div className="swap-on text-success">✔</div>
                    <div className="swap-off text-error">✘</div>
                </label>
            </div>
            <div className="flex justify-start items-center mt-2">
                <label className="mr-2" htmlFor="colorPicker">{chrome.i18n.getMessage("trailColor")}:</label>
                <input type="color"
                       id="colorPicker"
                       className="input input-sm"
                       onChange={handleStrokeStyleChange}
                       onBlur={saveConfig}
                       value={cfg.strokeStyle}/>
            </div>
            <div className="flex justify-start items-center mt-2 w-full">
                <label className="mr-2" htmlFor="colorPicker">{chrome.i18n.getMessage("trailWidth")}:</label>
                <input type="range" min={1} max="10" step="1"
                       value={cfg.lineWidth}
                       className="range range-xs w-1/2 mr-2"
                       onChange={handleLineWidthChange}
                       onBlur={saveConfig}/>
                <span>{cfg.lineWidth}</span>
            </div>
            <button className="btn btn-outline btn-sm mt-10"
                    onClick={resetConfig}>{chrome.i18n.getMessage("restoreDefaultSettings")}</button>
        </div>
    </div>}
  </>)
}

export default IndexOptions
