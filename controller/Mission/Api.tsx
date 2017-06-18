import Server from '../../pub/Server';
import Config from '../../pub/Config';

const MissionApi = {
   
    updateExperienceConfig: (basciInfo: {}) => {
        return Server.resource('POST', "Mission/UpdateExperienceConfig",
            basciInfo
        );
    },

    getExperienceConfig: (basciInfo: {}) => {
        return Server.resource('POST', "Mission/GetExperienceConfig",
            basciInfo
        );
    },

    getMissionInfoList: (basciInfo: {}) => {
        return Server.resource('POST', "Mission/GetMissionInfoList",
            basciInfo
        );
    },

    getMissionInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Mission/GetMissionInfo",
            basciInfo
        );
    },

    switchMissionEnable: (basciInfo: {}) => {
        return Server.resource('POST', "Mission/SwitchMissionEnable",
            basciInfo
        );
    },

    updateMissionInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Mission/UpdateMissionInfo",
            basciInfo
        );
    },

}

export default MissionApi;