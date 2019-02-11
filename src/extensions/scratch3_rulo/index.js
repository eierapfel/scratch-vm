const ArgumentType  = require('../../extension-support/argument-type');
const BlockType     = require('../../extension-support/block-type');
const Cast          = require('../../util/cast');
const languageNames = require('scratch-translate-extension-languages');
const formatMessage = require('format-message');
const ROSLIB        = require('roslib');

const iconURI = 'data:image/svg+xml;base64,PHN2ZyBpZD0i44Os44Kk44Ok44O8XzEiIGRhdGEtbmFtZT0i44Os44Kk44Ok44O8IDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDYyLjg3IDU5LjE5Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2UwZTBlMDt9LmNscy0ye2ZpbGw6IzJiMmIyYjt9LmNscy0ze2ZpbGw6I2Q4ZDZkNjt9LmNscy00e2ZpbGw6IzM2NDc3MDt9LmNscy01e2ZpbGw6IzIzMjMyMzt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPnJ1bG88L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQ4LjA1LDUyLjc1LDYxLjU5LDI5LjNBMTcuODcsMTcuODcsMCwwLDAsNDYuMTIsMi41SDE5QTE3Ljg3LDE3Ljg3LDAsMCwwLDMuNTYsMjkuM0wxNy4xMSw1Mi43NUExNy44NiwxNy44NiwwLDAsMCw0OC4wNSw1Mi43NVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xLjE0IC0yLjUpIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNDQuNjEsNDQuMzNsOC4xNy0xNi41OUExMy4zNSwxMy4zNSwwLDAsMCw0MC44LDguNUgyNC40N2ExMy4zNSwxMy4zNSwwLDAsMC0xMiwxOS4yNGw4LjE3LDE2LjU5QTEzLjM1LDEzLjM1LDAsMCwwLDQ0LjYxLDQ0LjMzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEuMTQgLTIuNSkiLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik00My4yOCw0Mi43NGw3LjIzLTE1LjU3QTExLjczLDExLjczLDAsMCwwLDM5Ljg2LDEwLjVIMjUuNDFBMTEuNzMsMTEuNzMsMCwwLDAsMTQuNzcsMjcuMTdMMjIsNDIuNzRBMTEuNzQsMTEuNzQsMCwwLDAsNDMuMjgsNDIuNzRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMS4xNCAtMi41KSIvPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iMjcuMTEiIHk9IjI5IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiByeD0iNCIgcnk9IjQiLz48cmVjdCBjbGFzcz0iY2xzLTUiIHg9IjI2LjExIiB3aWR0aD0iMTEiIGhlaWdodD0iMiIvPjwvc3ZnPg==';


class RuloClass {

    constructor()
    {
        //define of variable
        this.isRuloMoving     = false;
        this.isButtonPush     = (new Array(6)).fill(false);
        this.isLeftBumperHit  = false;
        this.isRightBumperHit = false;

        //this.ros_ = new ROSLIB.Ros({url:'ws://rulo.local:9090'});
        //this.ros_.on('connection', function(){console.log('Connected to rosbridge server.');});
        //this.ros_.on('error', function(error){console.log('Error connecting to rosbridge server: ', error);});
        //this.ros_.on('close', function(){console.log('Connection of rosbridge was closed.');});

        //Publisher and Subscliber
        this.publisher_  = new ROSLIB.Topic({ ros:this.ros_, name:'/scratch_ros', messageType:'std_msgs/String'});
        this.subscliber_ = new ROSLIB.Topic({ ros:this.ros_, name:'/ros_scratch', messageType:'std_msgs/String'});
        this.subscliber_.subscribe(message => { this.analysisRosMessage(message);});
    }

    setRosIp(ipAddress){
        this.ros_ = new ROSLIB.Ros({url: 'ws://' + ipAddress + ':9090'});
        this.ros_.on('connection', function(){console.log('Connected to rosbridge server.');});
        this.ros_.on('error', function(error){console.log('Error connecting to rosbridge server: ', error);});
        this.ros_.on('close', function(){console.log('Connection of rosbridge was closed.');});

        //Publisher and Subscliber
        this.publisher_  = new ROSLIB.Topic({ ros:this.ros_, name:'/scratch_ros', messageType:'std_msgs/String'});
        this.subscliber_ = new ROSLIB.Topic({ ros:this.ros_, name:'/ros_scratch', messageType:'std_msgs/String'});
        this.subscliber_.subscribe(message => { this.analysisRosMessage(message);});
        console.log('Rulo setRosIp : ' + ipAddress);
    }

    analysisRosMessage(message){
        console.log('Received message on ' + this.subscliber_.name + ': ' + message.data);
        var receivedData = message.data;

        if (this.isDataContainKeyword(receivedData,'arrival')){ moving_state = false; }
        else if(this.isDataContainKeyword(receivedData,'rulo_bumper:left_true')){   this.isLeftBumperHit  = true;  }
        else if(this.isDataContainKeyword(receivedData,'rulo_bumper:left_false')){  this.isLeftBumperHit  = false; }
        else if(this.isDataContainKeyword(receivedData,'rulo_bumper:right_true')){  this.isRightBumperHit = true;  }
        else if(this.isDataContainKeyword(receivedData,'rulo_bumper:right_false')){ this.isRightBumperHit = false; }
        else if(this.isDataContainKeyword(receivedData,'rulo_button')){
            var event_num = parseInt(receivedData.substr(12));
            if(event_num == 0){ this.isButtonPush  = (new Array(6)).fill(false); }
            else if(event_num == 1){  this.isButtonPush[0] = true; }
            else if(event_num == 2){  this.isButtonPush[1] = true; }
            else if(event_num == 4){  this.isButtonPush[2] = true; }
            else if(event_num == 8){  this.isButtonPush[3] = true; }
            else if(event_num == 16){ this.isButtonPush[4] = true; }
            else if(event_num == 32){ this.isButtonPush[5] = true; }
        }
    }

    isDataContainKeyword(data, keyword){
        if(data.indexOf(keyword) != -1){return true;}
        else{return false;}
    }

    publishScratchRos(message){
        const rosMsg = new ROSLIB.Message({ data : message});
        this.publisher_.publish(rosMsg);
    }

}//RuloClass


class Scratch3RuloBlocks {

    constructor (runtime) {
        this.extensionId = "rulo";
        console.log(this.extensionId);
        this.runtime_ = runtime;
        this.runtime_.registerPeripheralExtension(this.extensionId, this);
        this.runtime_.on('PROJECT_STOP_ALL', this.stopProgram.bind(this));
        this.rulo_ = new RuloClass();
    }

    static get STATE_KEY () { return 'scratch.rulo'; }

    stopProgram(){
        this.rulo_.publishScratchRos("rulo_cmd_vel:0,0");
        this.rulo_.publishScratchRos("rulo_clean:0,0");
        this.rulo_.publishScratchRos("scratch_stoped");
        this.rulo_.isRuloMoving = false;
    }

    setROSIP(args){ this.rulo_.setRosIp(String(args.ROS_IP)); }

    scan () {
        console.log('scan');
        // Not going to really 'scan' anything
        // When running from github.io, only connections to localhost can be safely established
        // Otherwise we need to use WebSocketSecure or host our own http site
        //this.connect('ws://localhost:9090');
        this.rulo_.setRosIp(String("192.168.0.17"));
    }

    connect (url) {
        console.log('connect');
        //this.ros = new RosUtil(this.runtime, this.extensionId, {url: url});
    }

    disconnect () {
        console.log('disconnect');
        //this.ros.socket.close();
    }

    isConnected () {
        //console.log('isConnected() called');
        console.log(this.rulo_.ros_.isConnected);
        return this.rulo_.ros_.isConnected;
        //return true;
    }

    setRuloMode(args){
        if(String(args.RULO_MODE) == "マニュアルモード"){    this.rulo_.publishScratchRos("rulo_drive_mode:manual"); }
        else if(String(args.RULO_MODE) == "ノーマルモード"){ this.rulo_.publishScratchRos("rulo_drive_mode:normal"); }
    }

    pushButtonEvent(args){
        if(String(args.RULO_BUTTON) == "スタート＆ストップ" && this.rulo_.isButtonPush[0] == true){ return true; }
        else if(String(args.RULO_BUTTON) == "ホーム"    && this.rulo_.isButtonPush[1] == true){ return true; }
        else if(String(args.RULO_BUTTON) == "念入り"    && this.rulo_.isButtonPush[2] == true){ return true; }
        else if(String(args.RULO_BUTTON) == "スポット"   && this.rulo_.isButtonPush[3] == true){ return true; }
        else if(String(args.RULO_BUTTON) == "予約"     && this.rulo_.isButtonPush[4] == true){ return true; }
        else if(String(args.RULO_BUTTON) == "毎日"     && this.rulo_.isButtonPush[5] == true){ return true; }
        else{ return false; }
    }

    pushBumperEvent(args){
        if( String(args.RULO_BUMPER)     == "右" && this.rulo_.isRightBumperHit){ return true; }
        else if(String(args.RULO_BUMPER) == "左" && this.rulo_.isLeftBumperHit){  return true; }
        else{ return false; }
    }

    pubCmdVel(args){
        var targetVel = Number(args.VEL_VALUE);
        var targetRad = Number(args.RAD_VALUE);

        if(targetVel < -40){ targetVel = -40; }
        if(targetVel >  40){ targetVel =  40; }
        if(targetRad < -90){ targetRad = -90; }
        if(targetRad >  90){ targetRad =  90; }

        this.rulo_.publishScratchRos("rulo_cmd_vel:" + String(targetVel) + ',' + String(targetRad));
        return new Promise(resolve => {setTimeout(() => {resolve();}, 100);});
        if(targetVel == 0 && targetRad == 0){ this.rulo_.isRuloMoving = false; }
        else{ this.rulo_.isRuloMoving = true; }
    }

    pubStopVel(args){
        this.rulo_.publishScratchRos("rulo_cmd_vel:0,0");
        this.rulo_.publishScratchRos("scratch_stoped");
        this.rulo_.isRuloMoving = false;
    }

    pubOdomBaseStraight(args){
        this.rulo_.publishScratchRos("rulo_straight:" + String(args.WORDS));
        this.rulo_.isRuloMoving = true;

        var targetDistance = Number(args.WORDS);
        if(targetDistance < 0){ targetDistance *=  -1; }
        var movingSpeed    = 30.0;
        var sleepTime      = (targetDistance / movingSpeed) * 1000;

        return new Promise(resolve => {setTimeout(() => {resolve();}, sleepTime);});
    }

    pubOdomBaseTurn(args){
        this.rulo_.publishScratchRos("rulo_turn:" + String(args.WORDS));
        this.rulo_.isRuloMoving = true;

        var targetAngle = Number(args.WORDS);
        if(targetAngle < 0){ targetAngle *=  -1; }
        var movingSpeed = 60.0
        var sleepTime = (targetAngle / movingSpeed) * 1000;

        return new Promise(resolve => {setTimeout(() => {resolve();}, sleepTime);});
    }

    pubClean(args){
        var targetPower = Number(args.Vacuum_VALUE);
        if(targetPower < 0){   targetPower *= -1; }
        if(targetPower > 100){ targetPower  = 100;}
        this.rulo_.publishScratchRos("rulo_clean:"+String(targetPower)+','+String(targetPower));
    }

    pubStopCrean(args){ this.rulo_.publishScratchRos("rulo_clean:0,0");}

    pubSpeech(args){ this.rulo_.publishScratchRos("speech:" + String(args.WORDS));}

    boolButton(args){
        console.log(this.rulo_.isButtonPush[0]);
        if(String(args.RULO_BUTTON) == "スタート＆ストップ"){ return this.rulo_.isButtonPush[0]; }
        else if(String(args.RULO_BUTTON) == "ホーム"){    return this.rulo_.isButtonPush[1]; }
        else if(String(args.RULO_BUTTON) == "念入り"){    return this.rulo_.isButtonPush[2]; }
        else if(String(args.RULO_BUTTON) == "スポット"){   return this.rulo_.isButtonPush[3]; }
        else if(String(args.RULO_BUTTON) == "予約"){     return this.rulo_.isButtonPush[4]; }
        else if(String(args.RULO_BUTTON) == "毎日"){     return this.rulo_.isButtonPush[5]; }
    }//boolButton

    boolBumper(args){
        if(String(args.RULO_BUMPER) == "右"){ return this.rulo_.isRightBumperHit; }
        if(String(args.RULO_BUMPER) == "左"){ return this.rulo_.isLeftBumperHit;  }
    }

    getInfo () {
        return {
            id: 'rulo',
            name: formatMessage({
                id: 'rulo.categoryName',
                default: 'Rulo'
            }),
            showStatusButton: true,
            menuIconURI: iconURI,
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'setROSIP',
                    text: formatMessage({id: 'rulo.setROSIP', default: '[ROS_IP]のRuloに接続する'}),
                    blockType: BlockType.COMMAND,
                    arguments: { ROS_IP:{type:ArgumentType.STRING, defaultValue:formatMessage({id:'rulo.setROSIP_Number',default:'192.168.0.1'})}}
                },
                {
                    opcode: 'setRuloMode',
                    text: formatMessage({id: 'rulo.setRuloMode', default: '動作モードを [RULO_MODE] にする'}),
                    blockType: BlockType.COMMAND,
                    arguments: { RULO_MODE:{type:ArgumentType.STRING, menu:'RULO_MODE', defaultValue:"マニュアルモード"}}
                },
                {
                    opcode: 'pushButtonEvent',
                    text: formatMessage({id: 'rulo.pushButtonEvent', default: '[RULO_BUTTON] ボタンが押された時'}),
                    blockType: BlockType.HAT,
                    arguments: { RULO_BUTTON:{type:ArgumentType.STRING, menu:'RULO_BUTTON', defaultValue:"スタート＆ストップ"}}
                },
                {
                    opcode: 'pushBumperEvent',
                    text: formatMessage({id: 'rulo.pushBumperEvent', default: '[RULO_BUMPER] バンパが押された時'}),
                    blockType: BlockType.HAT,
                    arguments: { RULO_BUMPER:{type:ArgumentType.STRING, menu:'RULO_BUMPER', defaultValue:"右"}}
                },
                {
                    opcode: 'pubCmdVel',
                    text: formatMessage({id:'rulo.pubCmdVel',　default:'前後 [VEL_VALUE]cm/秒 左右[RAD_VALUE]度/秒 で移動する'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VEL_VALUE:{type:ArgumentType.ANGLE, defaultValue:formatMessage({id:'rulo.pubCmdVel_Vel', default:'30'})},
                        RAD_VALUE:{type:ArgumentType.ANGLE, defaultValue:formatMessage({id:'rulo.pubCmdVel_Rad', default: '0'})}
                    }
                },
                {
                    opcode: 'pubOdomBaseStraight',
                    text: formatMessage({id: 'rulo.pubOdomBaseStraight', default: '[WORDS]cm 直進する'}),
                    blockType: BlockType.COMMAND,
                    arguments: {WORDS:{type:ArgumentType.ANGLE, defaultValue:formatMessage({id:'rulo.pubOdomBaseStraight_Number', default:'100'})}}
                },
                {
                    opcode: 'pubOdomBaseTurn',
                    text: formatMessage({id: 'rulo.pubOdomBaseTurn', default: '[WORDS]度回転する'}),
                    blockType: BlockType.COMMAND,
                    arguments: {WORDS:{type:ArgumentType.ANGLE, defaultValue:formatMessage({id:'rulo.pubOdomBaseTurn_Number',　default:'90'})}}
                },
                {
                    opcode: 'pubStopVel',
                    text: formatMessage({id: 'rulo.pubStopVel',　default: '移動を停止する'}),
                    blockType: BlockType.COMMAND,
                    arguments: {}
                },
                {
                    opcode: 'pubClean',
                    text: formatMessage({id: 'rulo.pubClean',　default: '[Vacuum_VALUE]% の強さで掃除する'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        Vacuum_VALUE: {type:ArgumentType.ANGLE, defaultValue:formatMessage({id:'rulo.pubClean_Vacuum', default:'50'})}
                    }
                },
                {
                    opcode: 'pubStopCrean',
                    text: formatMessage({id: 'rulo.pubStopCrean',　default: '掃除を停止する'}),
                    blockType: BlockType.COMMAND,
                    arguments: {}
                },
                {
                    opcode: 'pubSpeech',
                    text: formatMessage({id: 'rulo.pubSpeech', default: '[WORDS] と話す'}),
                    blockType: BlockType.COMMAND,
                    arguments: {WORDS:{type:ArgumentType.STRING, defaultValue:formatMessage({id:'rulo.pubSpeech_Word',　default:'こんにちは'})}}
                },
                {
                    opcode: 'boolButton',
                    text: formatMessage({id: 'rulo.boolButton',　default: '[RULO_BUTTON] ボタンが押されているか？'}),
                    blockType: BlockType.BOOLEAN,
                    arguments: {RULO_BUTTON: {type: ArgumentType.STRING, menu: 'RULO_BUTTON', defaultValue: "スタート＆ストップ"}}
                },
                {
                    opcode: 'boolBumper',
                    text: formatMessage({id: 'rulo.boolBumper',　default: '[RULO_BUMPER] バンパが押されているか？'}),
                    blockType: BlockType.BOOLEAN,
                    arguments: {RULO_BUMPER:{type:ArgumentType.STRING, menu:'RULO_BUMPER', defaultValue:"右"}}
                }
            ],
            menus: {
                RULO_BUTTON: ["スタート＆ストップ","ホーム","念入り","スポット","予約","毎日"],
                RULO_MODE: ["マニュアルモード","ノーマルモード"],
                RULO_BUMPER: ["右","左"]
            }
        }
    }//getInfo

}//Scratch3RuloBlocks

module.exports = Scratch3RuloBlocks;
