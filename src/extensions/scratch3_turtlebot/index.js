const ArgumentType  = require('../../extension-support/argument-type');
const BlockType     = require('../../extension-support/block-type');
const Cast          = require('../../util/cast');
const languageNames = require('scratch-translate-extension-languages');
const formatMessage = require('format-message');
const ROSLIB        = require('roslib');

const Clone          = require('../../util/clone');//追加
const Color          = require('../../util/color');
const MathUtil       = require('../../util/math-util');
const RenderedTarget = require('../../sprites/rendered-target');
const log            = require('../../util/log');
const StageLayering  = require('../../engine/stage-layering');


const iconURI = '';


class Turtlebot {

    constructor(){
        this.ros_ = new ROSLIB.Ros({url:'wss://192.168.11.11:9090'});
        this.ros_.on('connection', function() { console.log('Connected to rosbridge server.');});
        this.ros_.on('error', function(error) { console.log('Error connecting to rosbridge server: ', error);});
        this.ros_.on('close', function() {      console.log('Connection of rosbridge was closed.');});

        //Publisher and Subscliber
        this.publisher_  = new ROSLIB.Topic({ ros:this.ros_, name:'/scratch_ros', messageType:'std_msgs/String'});
        this.subscliber_ = new ROSLIB.Topic({ ros:this.ros_, name:'/ros_scratch', messageType:'std_msgs/String'});
        this.subscliber_.subscribe(message => { this.analysisRosMessage(message);});

        //define of variable
        this.isRobotMoving    = false;
        this.isButton0Push    = false;
        this.isButton1Push    = false;
        this.isButton2Push    = false;
        this.isfrontBumperHit = false;
        this.isLeftBumperHit  = false;
        this.isRightBumperHit = false;
    }

    setRosIp(ipAddress){
        this.ros_ = new ROSLIB.Ros({url: 'wss://' + ipAddress + ':9090'});
        this.ros_.on('connection', function() { console.log('Connected to rosbridge server.');});
        this.ros_.on('error', function(error) { console.log('Error connecting to rosbridge server: ', error);});
        this.ros_.on('close', function() {      console.log('Connection of rosbridge was closed.');});

        //Publisher and Subscliber
        this.publisher_  = new ROSLIB.Topic({ ros:this.ros_, name:'/scratch_ros', messageType:'std_msgs/String'});
        this.subscliber_ = new ROSLIB.Topic({ ros:this.ros_, name:'/ros_scratch', messageType:'std_msgs/String'});
        this.subscliber_.subscribe(message => { this.analysisRosMessage(message);});
        console.log('Turtlebot setRosIp : ' + ipAddress);
    }

    closeRosIp(ipAddress){
        this.ros_.close();
        console.log('Turtlebot closetRosIp : ' + ipAddress);
    }

    analysisRosMessage(message){
        console.log('Received message on ' + this.subscliber_.name + ': ' + message.data);
        var receivedData = message.data;

        if (this.isDataContainKeyword(receivedData,'arrival')){ this.isRobotMoving = false; }
        else if(this.isDataContainKeyword(receivedData,'front_bumper:true')){   this.isfrontBumperHit  = true;  }
        else if(this.isDataContainKeyword(receivedData,'front_bumper:false')){  this.isfrontBumperHit  = false; }
        else if(this.isDataContainKeyword(receivedData,'left_bumper:true')){    this.isLeftBumperHit = true;  }
        else if(this.isDataContainKeyword(receivedData,'left_bumper:false')){   this.isLeftBumperHit = false; }
        else if(this.isDataContainKeyword(receivedData,'right_bumper:true')){   this.isRightBumperHit  = true;  }
        else if(this.isDataContainKeyword(receivedData,'right_bumper:false')){  this.isRightBumperHit  = false; }

        else if(this.isDataContainKeyword(receivedData,'button_0:true')){   this.isButton0Push = true;  }
        else if(this.isDataContainKeyword(receivedData,'button_0:false')){  this.isButton0Push = false; }
        else if(this.isDataContainKeyword(receivedData,'button_1:true')){   this.isButton1Push  = true;  }
        else if(this.isDataContainKeyword(receivedData,'button_1:false')){  this.isButton1Push  = false; }
        else if(this.isDataContainKeyword(receivedData,'button_2:true')){   this.isButton2Push = true;  }
        else if(this.isDataContainKeyword(receivedData,'button_2:false')){  this.isButton2Push = false; }
    }

    isDataContainKeyword(data, keyword){
        if(data.indexOf(keyword) != -1){return true;}
        else{return false;}
    }

    publishScratchRos(message){
        const rosMsg = new ROSLIB.Message({ data : message});
        this.publisher_.publish(rosMsg);
    }

}//Turtlebot


class Scratch3TurtleBotBlocks {

    constructor (runtime) {
        this.runtime_ = runtime;
        this.runtime_.on('PROJECT_STOP_ALL', this.stopProgram.bind(this));
        this.turtlebot_ = new Turtlebot();
    }

    static get STATE_KEY () { return 'scratch.turtlebot'; }

    stopProgram (){ this.turtlebot_.publishScratchRos("motion_stop:True"); }

    setROSIP (args) {
        if(String(args.TURTLEBOT_NAME) == "TurtleBot_1"){       this.turtlebot_.setRosIp('192.168.11.11');  }
        else if(String(args.TURTLEBOT_NAME) == "TurtleBot_2"){  this.turtlebot_.setRosIp('192.168.1.20');  }
        else if(String(args.TURTLEBOT_NAME) == "TurtleBot_3"){  this.turtlebot_.setRosIp('192.168.1.30');  }
        else if(String(args.TURTLEBOT_NAME) == "TurtleBot_4"){  this.turtlebot_.setRosIp('192.168.1.40');  }
        else if(String(args.TURTLEBOT_NAME) == "TurtleBot_5"){  this.turtlebot_.setRosIp('192.168.1.50');  }
        else if(String(args.TURTLEBOT_NAME) == "TurtleBot_6"){  this.turtlebot_.setRosIp('192.168.1.60');  }
        else if(String(args.TURTLEBOT_NAME) == "TurtleBot_7"){  this.turtlebot_.setRosIp('192.168.1.70');  }
        else if(String(args.TURTLEBOT_NAME) == "TurtleBot_8"){  this.turtlebot_.setRosIp('192.168.1.80');  }
        else if(String(args.TURTLEBOT_NAME) == "TurtleBot_9"){  this.turtlebot_.setRosIp('192.168.1.90');  }
        else if(String(args.TURTLEBOT_NAME) == "TurtleBot_10"){ this.turtlebot_.setRosIp('192.168.1.100'); }
    }

    closeROSIP(args){
      if(String(args.TURTLEBOT_NAME) == "TurtleBot_1"){       this.turtlebot_.closeRosIp('192.168.11.11');  }
      else if(String(args.TURTLEBOT_NAME) == "TurtleBot_2"){  this.turtlebot_.closeRosIp('192.168.1.20');  }
      else if(String(args.TURTLEBOT_NAME) == "TurtleBot_3"){  this.turtlebot_.closeRosIp('192.168.1.30');  }
      else if(String(args.TURTLEBOT_NAME) == "TurtleBot_4"){  this.turtlebot_.closeRosIp('192.168.1.40');  }
      else if(String(args.TURTLEBOT_NAME) == "TurtleBot_5"){  this.turtlebot_.closeRosIp('192.168.1.50');  }
      else if(String(args.TURTLEBOT_NAME) == "TurtleBot_6"){  this.turtlebot_.closeRosIp('192.168.1.60');  }
      else if(String(args.TURTLEBOT_NAME) == "TurtleBot_7"){  this.turtlebot_.closeRosIp('192.168.1.70');  }
      else if(String(args.TURTLEBOT_NAME) == "TurtleBot_8"){  this.turtlebot_.closeRosIp('192.168.1.80');  }
      else if(String(args.TURTLEBOT_NAME) == "TurtleBot_9"){  this.turtlebot_.closeRosIp('192.168.1.90');  }
      else if(String(args.TURTLEBOT_NAME) == "TurtleBot_10"){ this.turtlebot_.closeRosIp('192.168.1.100'); }
    }

    stopMotion (args) {
      this.turtlebot_.publishScratchRos("motion_stop:True");
    }

    pushBumper (args) {
        if(String(args.TURTLEBOT_BUMPER) == "前方"){    return this.turtlebot_.isfrontBumperHit; }
        else if(String(args.TURTLEBOT_BUMPER) == "右"){ return this.turtlebot_.isRightBumperHit; }
        else if(String(args.TURTLEBOT_BUMPER) == "左"){ return this.turtlebot_.isLeftBumperHit; }
    }

    boolBumper (args) {
        if(String(args.TURTLEBOT_BUMPER) == "前方"){    return this.turtlebot_.isfrontBumperHit; }
        else if(String(args.TURTLEBOT_BUMPER) == "右"){ return this.turtlebot_.isRightBumperHit; }
        else if(String(args.TURTLEBOT_BUMPER) == "左"){ return this.turtlebot_.isLeftBumperHit; }
    }//boolBumper

    pushButton (args) {//HAT
        if(String(args.TURTLEBOT_BUTTON) == "0"){      return this.turtlebot_.isButton0Push; }
        else if(String(args.TURTLEBOT_BUTTON) == "1"){ return this.turtlebot_.isButton1Push; }
        else if(String(args.TURTLEBOT_BUTTON) == "2"){ return this.turtlebot_.isButton2Push; }
    }

    boolButton (args) {//BOOLEAN
        if(String(args.TURTLEBOT_BUTTON) == "0"){      return this.turtlebot_.isButton0Push; }
        else if(String(args.TURTLEBOT_BUTTON) == "1"){ return this.turtlebot_.isButton1Push; }
        else if(String(args.TURTLEBOT_BUTTON) == "2"){ return this.turtlebot_.isButton2Push; }
    }

    pubLED (args) {
        if(String(args.TURTLEBOT_LED) == "消灯"){    this.turtlebot_.publishScratchRos("LED:off");    }
        else if(String(args.TURTLEBOT_LED) == "緑"){ this.turtlebot_.publishScratchRos("LED:green");  }
        else if(String(args.TURTLEBOT_LED) == "黃"){ this.turtlebot_.publishScratchRos("LED:yellow"); }
        else if(String(args.TURTLEBOT_LED) == "赤"){ this.turtlebot_.publishScratchRos("LED:red");    }
    }

    pubSound (args) {
        if(String(args.TURTLEBOT_SOUND) == "スイッチON"){       this.turtlebot_.publishScratchRos("sound:0"); }
        else if(String(args.TURTLEBOT_SOUND) == "スイッチOFF"){ this.turtlebot_.publishScratchRos("sound:1"); }
        else if(String(args.TURTLEBOT_SOUND) == "充電中"){     this.turtlebot_.publishScratchRos("sound:2"); }
        else if(String(args.TURTLEBOT_SOUND) == "ボタン"){      this.turtlebot_.publishScratchRos("sound:3"); }
        else if(String(args.TURTLEBOT_SOUND) == "エラー"){      this.turtlebot_.publishScratchRos("sound:4"); }
        else if(String(args.TURTLEBOT_SOUND) == "休憩"){       this.turtlebot_.publishScratchRos("sound:5"); }
        else if(String(args.TURTLEBOT_SOUND) == "驚き"){       this.turtlebot_.publishScratchRos("sound:6"); }
    }

    pubGo_straight (args) {

        this.turtlebot_.publishScratchRos("S:"+String(args.GO_STRAIGHT));

        var targetLength = Number(args.GO_STRAIGHT);
        if(targetLength < 0){ targetLength *= -1; }
        var marginTime  = 2;//[sec]
        var movingSpeed = 40;//[cm/sec]
        var sleepTime   = ((targetLength / movingSpeed) + marginTime) * 1000;

        return new Promise(resolve => { setTimeout(() => {resolve();}, sleepTime); });
    }


    pubAngle (args) {
        this.turtlebot_.publishScratchRos("T:"+String(args.TURTLEBOT_ANGLE));

        var targetAngle = Number(args.TURTLEBOT_ANGLE);
        if(targetAngle < 0){ targetAngle *= -1; }
        var marginTime   = 1.5;
        var stepNum      = 10;
        var increaseRate = 0.5;
        var sleepTime    =  ((targetAngle / stepNum * increaseRate) + marginTime) * 1000;

        return new Promise(resolve => { setTimeout(() => {resolve();}, sleepTime); });
    }

    getInfo () {
        return {
            id: 'turtlebot',
            name: formatMessage({
                id: 'turtlebot.categoryName',
                default: 'TurtleBot'
            }),
            showStatusButton: true,
            menuIconURI: iconURI,
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'setROSIP',
                    text: formatMessage({id: 'turtlebot.setROSIP', default: '[TURTLEBOT_NAME] に接続する'}),
                    blockType: BlockType.COMMAND,
                    arguments: { TURTLEBOT_NAME: {type:ArgumentType.STRING, menu:'TURTLEBOT_NAME', defaultValue:"TurtleBot_1"}}
                },
                {
                  opcode: 'closeROSIP',
                  text: formatMessage({id: 'turtlebot.closeROSIP', default: '[TURTLEBOT_NAME] を切断する'}),
                  blockType: BlockType.COMMAND,
                  arguments: { TURTLEBOT_NAME: {type:ArgumentType.STRING, menu:'TURTLEBOT_NAME', defaultValue:"TurtleBot_1"}}
                },
                {
                    opcode: 'stopMotion',
                    text: formatMessage({id: 'turtlebot.stopMotion', default: 'TurtleBotの動きを止める'}),
                    blockType: BlockType.COMMAND,
                    arguments: {}
                },
                {
                    opcode: 'pushBumper',
                    text: formatMessage({id: 'turtlebot.pushBumper', default: '[TURTLEBOT_BUMPER] のバンパーが押された時'}),
                    blockType: BlockType.HAT,
                    arguments: { TURTLEBOT_BUMPER: {type:ArgumentType.STRING, menu:'TURTLEBOT_BUMPER', defaultValue:"前方"}}
                },
                {
                    opcode: 'pushButton',
                    text: formatMessage({id: 'turtlebot.pushButton', default: '[TURTLEBOT_BUTTON] のボタンが押された時'}),
                    blockType: BlockType.HAT,
                    arguments: { TURTLEBOT_BUTTON: {type:ArgumentType.STRING, menu:'TURTLEBOT_BUTTON', defaultValue:"0"}}
                },
                {
                    opcode: 'pubSound',
                    text: formatMessage({id: 'turtlebot.pubSound', default: '[TURTLEBOT_SOUND] のブザー'}),
                    blockType: BlockType.COMMAND,
                    arguments: { TURTLEBOT_SOUND: {type:ArgumentType.STRING, menu:'TURTLEBOT_SOUND', defaultValue:"スイッチON"}}
                },
                {
                    opcode: 'pubLED',
                    text: formatMessage({id: 'turtlebot.pubLED', default: 'LEDを [TURTLEBOT_LED] にする'}),
                    blockType: BlockType.COMMAND,
                    arguments: { TURTLEBOT_LED: {type:ArgumentType.STRING, menu:'TURTLEBOT_LED', defaultValue:"消灯"}}
                },
                {
                    opcode: 'pubGo_straight',
                    text: formatMessage({id: 'turtlebot.pubGo_straight', default: '[GO_STRAIGHT] cm 直進する'}),
                    blockType: BlockType.COMMAND,
                    arguments: { GO_STRAIGHT:{type: ArgumentType.ANGLE, defaultValue:formatMessage({id:'turtlebot.turtlebot_go_straight',　default:'15'})}}
                },
                {
                    opcode: 'pubAngle',
                    text: formatMessage({id: 'turtlebot.pubAngle', default: '[TURTLEBOT_ANGLE] に角度を指定　--マイナスが右回転'}),
                    blockType: BlockType.COMMAND,
                    arguments: { TURTLEBOT_ANGLE:{type: ArgumentType.ANGLE, defaultValue:formatMessage({id:'turtlebot.angle',　default:'90'})}}
                },
                {
                    opcode: 'boolBumper',
                    text: formatMessage({id: 'turtlebot.boolBumper',　default: '[TURTLEBOT_BUMPER] のバンパーが押されている'}),
                    blockType: BlockType.BOOLEAN,
                    arguments: { TURTLEBOT_BUMPER:{type:ArgumentType.STRING, menu:'TURTLEBOT_BUMPER', defaultValue:"前方"}}
                },
                {
                    opcode: 'boolButton',
                    text: formatMessage({id: 'turtlebot.boolButton',　default: '[TURTLEBOT_BUTTON] のボタンが押されている'}),
                    blockType: BlockType.BOOLEAN,
                    arguments: {TURTLEBOT_BUTTON:{type:ArgumentType.STRING, menu:'TURTLEBOT_BUTTON', defaultValue:"0"}}
                }
            ],
            menus: {
                TURTLEBOT_NAME: ["TurtleBot_1","TurtleBot_2","TurtleBot_3","TurtleBot_4","TurtleBot_5","TurtleBot_6","TurtleBot_7","TurtleBot_8","TurtleBot_9","TurtleBot_10"],
                TURTLEBOT_LED: ["消灯","赤","黃","緑"],
                TURTLEBOT_SOUND: ["スイッチON","スイッチOFF","充電中","ボタン","エラー","休憩","驚き"],
                TURTLEBOT_BUMPER: ["前方","左","右"],
                TURTLEBOT_BUTTON: ["0","1","2"]
            }
        }
    }

}//Scratch3TurtleBotBlocks

module.exports = Scratch3TurtleBotBlocks;
