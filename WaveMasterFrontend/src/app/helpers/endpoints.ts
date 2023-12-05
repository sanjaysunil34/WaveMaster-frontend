//Capture service APIs
export const CAPTURE_PLOT_COMMAND= "/capture/plotcommand";
export const CAPTURE_OBSERSERS= "/capture/observers";
export const CAPTURE_SIGNAL_DATA= "/capture/signaldata";
export const CAPTURE_RATE= "/capture/rate";
//Capture hub events
export const CAPTURE_PLOT_DATA = "transferPlotData";
export const CAPTURE_CONTROL = "captureControl";
export const CAPTURE_FETCH_DATA = "fetchData";



//Connection service APIs
export const HUB_URL = "http://localhost:3000/plotValue";
export const CONFIGURATION_PORTS = "/configuration";
export const CONFIGURATION_CONNECT = "/configuration/connect";
export const CONFIGURATION_DISCONNECT = "/configuration/disconnect";



//Generate service APIs
export const GENERATE_START = "/generate/start";
export const GENERATE_STOP = "/generate/stop";
export const GENERATE_RESTORE = "/generate";
export const GENERATE_SAVE_EEPROM = "/generate/eepromsave";
export const GENERATE_READ_EEPROM = "/generate/eepromread";
//Generate hub events
export const GENERATE_DEFAULT_DATA = "defaultData";



//Test service APIs
export const TEST = "/test";
//Test service hub events
export const TEST_HUB = "test";