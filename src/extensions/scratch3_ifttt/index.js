const ArgumentType  = require('../../extension-support/argument-type');
const BlockType     = require('../../extension-support/block-type');
const Cast          = require('../../util/cast');
const languageNames = require('scratch-translate-extension-languages');
const formatMessage = require('format-message');
const ifttt         = require('node-ifttt-maker');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAACsklEQVR4Xu2bz2vTYBjHn6Q/HK62SmV1Q9DBENnBHQR1Duw8eBIc+Bd4UTYn9qAnYRcR71XmQC/+KROsK2xEpgWPg1LQtGsrNe2sTfOOgqfRJO+TptsC35wKefK+z/N5P3mgbxKFcPQloIBLfwIAY2MGwAAMr2nAGBgzDGM+iBRZ9CgZMecUlUK8KY5HtLCoW+2Ec6TSe3qo6G5Zud9K7zppCoXX3QYK1PmuOU+PI5+ccnYGs2qco/Doz0AVLZus2Ryn5dgvu3BnMG//vKRobEV2rkDFdVqv6MmobW2OYJJrv9eraiIdqIIlk41ZRt5YOjXryZjkWi1XVc/clJwrUGFxq6E1lhJXAeYAAYCxUQJgAIbX4mAMjIExPAIwhscLPQbGwBgeARjD44UeA2NgDI8AjOHxQo+BMTCGRwDG8Hihx8AYGMMjAGN4vNBjYAyM4RGAMTxeA/WYS9mdXF2JH/lDfUGCWqbJq9wlOiYMrfxsyttD/Z2F2fx4q3bd14w8DFYXRHfKYRpxf/9LevSoqmpfvn73BubH/dsbqb36DenZhhRYt4juVUL+glFUbWNrE2AOrlkUYPprDDA2tzfAAAyv88MYGANjeARgDI8XegyMgTE8AjCGx2vQHpNP7dWPftvh2P27Xrj1OfWvMcdbC/+jh7HtEBHKZl7bumaXrePWj5aezl48GX3qf6m8EYcBpt1uvykUChlPYJ5Pjl15cXlim1eG/9HDAKPr+kypVPrmCQwRhV5Pn19evHA263+58iP6DaZSqWSKxeIqEXW9guldd+LuWHx+cTL1YOJ0YkaooUP/vNiwBGX0LkUH2PMVZHWNZnO7vLv7sVar9b4KbjstjexUvbiRHiQikr1GXonDiRT/Yfwlot5vxyOoRbrVNfB5gLFBCDAAw7u7YAyM4RmzD7rXF2VZ3VMVAAAAAElFTkSuQmCC';


class IFTTT {

    constructor(){
        this.event_ = 'user_notification';
        this.ifttt_ = new ifttt('bbHNl2aLk2A7yS1rSm6fNK');
        this.ifttt_.request(this.event_);
    }

    sendWebhook(eventName){
        this.ifttt_.request(eventName);
    }

}//IFTTT


class Scratch3IFTTTBlocks {

    constructor (runtime) {
        this.runtime_ = runtime;
        this.runtime_.on('PROJECT_STOP_ALL', this.stopProgram.bind(this));
        this.ifttt_ = new IFTTT;
    }

    static get STATE_KEY () { return 'scratch.ifttt'; }

    stopProgram(){
        console.log("この昨日はぜんざいサポートしていません");
    }

    ctrlTv(args){ console.log("この機能はぜんざいサポートしていません"); }
    ctrlTvChannel(args){ console.log("この機能はぜんざいサポートしていません"); }
    ctrlCooler(args){ console.log("この機能はぜんざいサポートしていません"); }
    ctrlCoolerTmp(args){ console.log("この機能はぜんざいサポートしていません"); }
    deviceStatus(args){ console.log("この機能はぜんざいサポートしていません"); }

    ctrlLight(args){
        if(String(args.MENU_ON_OFF) == "ON"){
            this.ifttt_.sendWebhook('scratch_turn_on_the_light');
            console.log("ifttt: scratch_turn_on_the_light");
        }
        else{
            this.ifttt_.sendWebhook('scratch_turn_off_the_light');
            console.log("ifttt: scratch_turn_off_the_light");
        }
    }

    ctrlPowerTap(args){
        if(String(args.MENU_ON_OFF) == "ON"){
            this.ifttt_.sendWebhook('scratch_turn_on_the_tap');
            console.log("ifttt: scratch_turn_on_the_tap");
        }
        else{
            this.ifttt_.sendWebhook('scratch_turn_off_the_tap');
            console.log("ifttt: scratch_turn_off_the_tap");
        }
    }

    getInfo () {
        return {
            id: 'ifttt',
            name: formatMessage({
                id: 'ifttt.categoryName',
                default: 'IFTTT'
            }),
            showStatusButton: true,
            menuIconURI: iconURI,
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'ctrlTv',
                    text: formatMessage({id: 'ifttt.ctrlTv', default: 'テレビの電源を [MENU_ON_OFF] にする'}),
                    blockType: BlockType.COMMAND,
                    arguments: { MENU_ON_OFF:{type:ArgumentType.STRING, menu:'MENU_ON_OFF', defaultValue:"ON"}}
                },
                {
                    opcode: 'ctrlTvChannel',
                    text: formatMessage({id: 'ifttt.ctrlTvChannel', default: 'テレビのチャンネルを [MENU_NUM] にする'}),
                    blockType: BlockType.COMMAND,
                    arguments: { MENU_NUM:{type:ArgumentType.STRING, menu:'MENU_NUM', defaultValue:"7"}}
                },
                {
                    opcode: 'ctrlLight',
                    text: formatMessage({id: 'ifttt.ctrlLight', default: '照明の電源を [MENU_ON_OFF] にする'}),
                    blockType: BlockType.COMMAND,
                    arguments: { MENU_ON_OFF:{type:ArgumentType.STRING, menu:'MENU_ON_OFF', defaultValue:"ON"}}
                },
                {
                    opcode: 'ctrlCooler',
                    text: formatMessage({id: 'ifttt.ctrlCooler', default: 'エアコンの電源を [MENU_ON_OFF] にする'}),
                    blockType: BlockType.COMMAND,
                    arguments: { MENU_ON_OFF:{type:ArgumentType.STRING, menu:'MENU_ON_OFF', defaultValue:"ON"}}
                },
                {
                    opcode: 'ctrlCoolerTmp',
                    text: formatMessage({id: 'ifttt.ctrlCoolerTmp', default: 'エアコンの設定温度を [MENU_COOLER_TMP] にする'}),
                    blockType: BlockType.COMMAND,
                    arguments: { MENU_COOLER_TMP:{type:ArgumentType.STRING, menu:'MENU_COOLER_TMP', defaultValue:"28"}}
                },
                {
                    opcode: 'ctrlPowerTap',
                    text: formatMessage({id: 'ifttt.ctrlPowerTap', default: 'コンセントの電源を [MENU_ON_OFF] にする'}),
                    blockType: BlockType.COMMAND,
                    arguments: { MENU_ON_OFF:{type:ArgumentType.STRING, menu:'MENU_ON_OFF', defaultValue:"ON"}}
                },
                {
                    opcode: 'deviceStatus',
                    text: formatMessage({id: 'ifttt.deviceStatus',　default: '[MENU_DEVICE] の電源は付いているか？'}),
                    blockType: BlockType.BOOLEAN,
                    arguments: {MENU_DEVICE: {type: ArgumentType.STRING, menu: 'MENU_DEVICE', defaultValue: "テレビ"}}
                }
            ],
            menus: {
                MENU_COOLER_TMP: ["20","22","24","26","28","30"],
                MENU_NUM:        ["1","2","3","4","5","6","7","8","9","10","11","12"],
                MENU_DEVICE:     ["テレビ","照明","エアコン","ポット","コンセント"],
                MENU_ON_OFF:     ["ON","OFF"]
            }
        }
    }//getInfo

}//Scratch3IFTTTBlocks

module.exports = Scratch3IFTTTBlocks;
