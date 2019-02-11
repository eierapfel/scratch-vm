const Runtime       = require('../../engine/runtime');
const ArgumentType  = require('../../extension-support/argument-type');
const BlockType     = require('../../extension-support/block-type');
const Clone         = require('../../util/clone');
const Cast          = require('../../util/cast');
const formatMessage = require('format-message');
const Video         = require('../../io/video');
const VideoMotion   = require('./library');
const posenet       = require('@tensorflow-models/posenet');
const babelPolyfill = require('babel-polyfill');

const menuIconURI = 'data:image/png;base64,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';

const blockIconURI = 'data:image/png;base64,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';


const SensingAttribute = {
    MOTION: 'motion',
    DIRECTION: 'direction'
};

const SensingSubject = {
    STAGE: 'Stage',
    SPRITE: 'this sprite'
};

const VideoState = {
    OFF: 'off',
    ON: 'on',
    ON_FLIPPED: 'on-flipped'
};

var detectThreshold = 0.1;

var isContainHuman = false;
var noseX;
var noseY;
var leftEyeX;
var leftEyeY;
var rightEyeX;
var rightEyeY;
var leftEarX;
var leftEarY;
var rightEarX;
var rightEarY;
var leftShoulderX;
var leftShoulderY;
var rightShoulderX;
var rightShoulderY;
var leftElbowX;
var leftElbowY;
var rightElbowX;
var rightElbowY;
var leftWristX;
var leftWristY;
var rightWristX;
var rightWristY;
var leftHipX;
var leftHipY;
var rightHipX;
var rightHipY;
var leftKneeX;
var leftKneeY;
var rightKneeX;
var rightKneeY;
var leftAnkleX;
var leftAnkleY;
var rightAnkleX;
var rightAnkleY;

var net;

async function loadPoseNet() {
    net = await posenet.load(0.50);
}

async function estimatePoseOnImage(imageElement) {

    var imageScaleFactor = 0.5;
    var outputStride     = 16;
    var flipHorizontal   = false;
    var pose             = await net.estimateSinglePose(imageElement, imageScaleFactor, flipHorizontal, outputStride);

    if(pose.score > detectThreshold){ isContainHuman = true; }
    else{ isContainHuman = false; }

    if(pose.keypoints.length > 0){
        for(var i = 0; i < pose.keypoints.length; i++){
            var name = pose.keypoints[i].part;
            var pos  = pose.keypoints[i].position;

            pos.x -= 240;
            pos.y  = (pos.y-180) * -1;

            if(pos.x < -240 || pos.y < -180 || pos.x > 240 || pos.y > 180){pos.x = pos.y = -1000;}

            if(name == 'nose'){
                noseX = pos.x;
                noseY = pos.y;
            }else if(name == 'leftEye'){
                leftEyeX = pos.x;
                leftEyeY = pos.y;
            }else if(name == 'rightEye'){
                rightEyeX = pos.x;
                rightEyeY = pos.y;
            }else if(name == 'leftEar'){
                leftEarX = pos.x;
                leftEarY = pos.y;
            }else if(name == 'rightEar'){
                rightEarX = pos.x;
                rightEarY = pos.y;
            }else if(name == 'leftShoulder'){
                leftShoulderX = pos.x;
                leftShoulderY = pos.y;
            }else if(name == 'rightShoulder'){
                rightShoulderX = pos.x;
                rightShoulderY = pos.y;
            }else if(name == 'leftElbow'){
                leftElbowX = pos.x;
                leftElbowY = pos.y;
            }else if(name == 'rightElbow'){
                rightElbowX = pos.x;
                rightElbowY = pos.y;
            }else if(name == 'leftWrist'){
                leftWristX = pos.x;
                leftWristY = pos.y;
            }else if(name == 'rightWrist'){
                rightWristX = pos.x;
                rightWristY = pos.y;
            }else if(name == 'leftHip'){
                leftHipX = pos.x;
                leftHipY = pos.y;
            }else if(name == 'rightHip'){
                rightHipX = pos.x;
                rightHipY = pos.y;
            }else if(name == 'leftKnee'){
                leftKneeX = pos.x;
                leftKneeY = pos.y;
            }else if(name == 'rightKnee'){
                rightKneeX = pos.x;
                rightKneeY = pos.y;
            }else if(name == 'leftAnkle'){
                leftAnkleX = pos.x;
                leftAnkleY = pos.y;
            }else if(name == 'rightAnkle'){
                rightAnkleX = pos.x;
                rightAnkleY = pos.y;
            }
        }
    }
    return pose;
}


class Scratch3TfVideoSensingBlocks {

    constructor (runtime) {

        this.runtime = runtime;
        this.detect = new VideoMotion();

        loadPoseNet();

        this._lastUpdate = null;
        this.firstInstall = true;

        if (this.runtime.ioDevices) {
            this.runtime.on(Runtime.PROJECT_LOADED, this.updateVideoDisplay.bind(this));
            this.runtime.on(Runtime.PROJECT_RUN_START, this.reset.bind(this));
            this._loop();
        }
    }

    static get INTERVAL () { return 33; }

    static get DIMENSIONS () { return [480, 360]; }

    static get STATE_KEY () { return 'Scratch.tfVideoSensing'; }

    static get DEFAULT_MOTION_STATE () {
        return {
            motionFrameNumber: 0,
            motionAmount: 0,
            motionDirection: 0
        };
    }

    get globalVideoTransparency () {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoTransparency;
        }
        return 50;
    }

    set globalVideoTransparency (transparency) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoTransparency = transparency;
        }
        return transparency;
    }

    get globalVideoState () {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoState;
        }
        return VideoState.OFF;
    }

    set globalVideoState (state) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoState = state;
        }
        return state;
    }

    updateVideoDisplay () {
        this.setVideoTransparency({
            TRANSPARENCY: this.globalVideoTransparency
        });
        this.videoToggle({
            VIDEO_STATE: this.globalVideoState
        });
    }

    reset () {
        this.detect.reset();

        const targets = this.runtime.targets;
        for (let i = 0; i < targets.length; i++) {
            const state = targets[i].getCustomState(Scratch3TfVideoSensingBlocks.STATE_KEY);
            if (state) {
                state.motionAmount = 0;
                state.motionDirection = 0;
            }
        }
    }


    _loop () {
        setTimeout(this._loop.bind(this), Math.max(this.runtime.currentStepTime, Scratch3TfVideoSensingBlocks.INTERVAL));

        // Add frame to detector
        const time = Date.now();
        if (this._lastUpdate === null) {
            this._lastUpdate = time;
        }
        const offset = time - this._lastUpdate;
        if (offset > Scratch3TfVideoSensingBlocks.INTERVAL) {
            const frame = this.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: Scratch3TfVideoSensingBlocks.DIMENSIONS
            });
            if (frame) {
                this._lastUpdate = time;
                //this.detect.addFrame(frame.data);
                //console.log("loop");

                //pose = this.posenet_.estimateSinglePose(frame.data, imageScaleFactor, flipHorizontal, outputStride);
                image = new ImageData(frame.data, 480);
                pose = estimatePoseOnImage(image);
                console.log(pose);
            }
        }
    }

    _buildMenu (info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = entry.value || String(index + 1);
            return obj;
        });
    }

    _getMotionState (target) {
        let motionState = target.getCustomState(Scratch3TfVideoSensingBlocks.STATE_KEY);
        if (!motionState) {
            motionState = Clone.simple(Scratch3TfVideoSensingBlocks.DEFAULT_MOTION_STATE);
            target.setCustomState(Scratch3TfVideoSensingBlocks.STATE_KEY, motionState);
        }
        return motionState;
    }

    static get SensingAttribute () {
        return SensingAttribute;
    }

    get ATTRIBUTE_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'tfVideoSensing.motion',
                    default: 'motion',
                    description: 'Attribute for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingAttribute.MOTION
            },
            {
                name: formatMessage({
                    id: 'tfVideoSensing.direction',
                    default: 'direction',
                    description: 'Attribute for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingAttribute.DIRECTION
            }
        ];
    }

    static get SensingSubject () {
        return SensingSubject;
    }

    get SUBJECT_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'tfVideoSensing.sprite',
                    default: 'sprite',
                    description: 'Subject for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingSubject.SPRITE
            },
            {
                name: formatMessage({
                    id: 'tfVideoSensing.stage',
                    default: 'stage',
                    description: 'Subject for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingSubject.STAGE
            }
        ];
    }

    static get VideoState () {
        return VideoState;
    }

    get VIDEO_STATE_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'tfVideoSensing.off',
                    default: 'off',
                    description: 'Option for the "turn video [STATE]" block'
                }),
                value: VideoState.OFF
            },
            {
                name: formatMessage({
                    id: 'tfVideoSensing.on',
                    default: 'on',
                    description: 'Option for the "turn video [STATE]" block'
                }),
                value: VideoState.ON
            },
            {
                name: formatMessage({
                    id: 'tfVideoSensing.onFlipped',
                    default: 'on flipped',
                    description: 'Option for the "turn video [STATE]" block that causes the video to be flipped' +
                        ' horizontally (reversed as in a mirror)'
                }),
                value: VideoState.ON_FLIPPED
            }
        ];
    }

    getInfo () {
        if (this.firstInstall) {
            this.globalVideoState = VideoState.ON;
            this.globalVideoTransparency = 50;
            this.updateVideoDisplay();
            this.firstInstall = false;
        }

        // Return extension definition
        return {
            id: 'tfVideoSensing',
            name: formatMessage({
                id: 'tfVideoSensing.categoryName',
                default: 'AI Video Sensing',
                description: 'Label for the AI video sensing extension category'
            }),
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [
                {
                    opcode: 'setMinConfidence',
                    text: formatMessage({id:'tfVideoSensing.setMinConfidence',　default:'MinConfidenceを [VALUE] %に設定する'}),
                    blockType: BlockType.COMMAND,
                    arguments: {VALUE:{type:ArgumentType.NUMBER, defaultValue:formatMessage({id:'tfVideoSensing.setMinConfidenceValue', default:"10"})}}
                },
                {
                    opcode: 'whenDetectHuman',
                    text: formatMessage({
                        id: 'tfVideoSensing.whenDetectHuman',
                        default: '人を見つけた時',
                        description: 'Event that triggers when the amount of motion is greater than [REFERENCE]'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {}
                },
                {
                    opcode: 'getPointX',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tfVideoSensing.getPointX',
                        default: '[MENU_BODY_PARTS]のx座標',
                        description: 'Reporter that returns xxx'
                    }),
                    arguments: {MENU_BODY_PARTS: {type: ArgumentType.STRING, menu: 'MENU_BODY_PARTS', defaultValue: "鼻"}}
                },
                {
                    opcode: 'getPointY',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tfVideoSensing.getPointY',
                        default: '[MENU_BODY_PARTS]のy座標',
                        description: 'Reporter that returns xxx'
                    }),
                    arguments: {MENU_BODY_PARTS: {type: ArgumentType.STRING, menu: 'MENU_BODY_PARTS', defaultValue: "鼻"}}
                },
                {
                    opcode: 'videoToggle',
                    text: formatMessage({
                        id: 'tfVideoSensing.videoToggle',
                        default: 'ビデオを[VIDEO_STATE]にする',
                        description: 'Controls display of the video preview layer'
                    }),
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.NUMBER,
                            menu: 'VIDEO_STATE',
                            defaultValue: VideoState.ON
                        }
                    }
                },
                {
                    opcode: 'setVideoTransparency',
                    text: formatMessage({
                        id: 'tfVideoSensing.setVideoTransparency',
                        default: 'ビデオの透明度を [TRANSPARENCY]にする',
                        description: 'Controls transparency of the video preview layer'
                    }),
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                }
            ],
            menus: {
                ATTRIBUTE:       this._buildMenu(this.ATTRIBUTE_INFO),
                SUBJECT:         this._buildMenu(this.SUBJECT_INFO),
                VIDEO_STATE:     this._buildMenu(this.VIDEO_STATE_INFO),
                MENU_BODY_PARTS: ["鼻","左目","右目","左耳","右耳","左肩","右肩","左肘","右肘","左手首","右手首","左尻","右尻","左膝","右膝","左足首","右足首"]
            }
        };
    }

    _analyzeLocalMotion (target) {
        const drawable = this.runtime.renderer._allDrawables[target.drawableID];
        const state = this._getMotionState(target);
        this.detect.getLocalMotion(drawable, state);
        return state;
    }

    setMinConfidence(args){
        var minConfidence = Number(args.VALUE);
        detectThreshold = (minConfidence / 100);
    }

    getPointX (args) {
        var name = String(args.MENU_BODY_PARTS);
        if(name == "鼻"){ return noseX; }
        else if(name == "左目"){ return leftEyeX; }
        else if(name == "右目"){ return rightEyeX; }
        else if(name == "左耳"){ return leftEarX; }
        else if(name == "右耳"){ return rightEarX; }
        else if(name == "左肩"){ return leftShoulderX;}
        else if(name == "右肩"){ return rightShoulderX; }
        else if(name == "左肘"){ return leftElbowX; }
        else if(name == "右肘"){ return rightElbowX; }
        else if(name == "左手首"){ return leftWristX; }
        else if(name == "右手首"){ return rightWristX; }
        else if(name == "左尻"){ return leftHipX; }
        else if(name == "右尻"){ return rightHipX; }
        else if(name == "左膝"){ return leftKneeX; }
        else if(name == "右膝"){ return rightKneeX; }
        else if(name == "左足首"){ return leftAnkleX; }
        else if(name == "右足首"){ return rightAnkleX; }
    }

    getPointY (args) {
        var name = String(args.MENU_BODY_PARTS);
        if(name == "鼻"){ return noseY; }
        else if(name == "左目"){ return leftEyeY; }
        else if(name == "右目"){ return rightEyeY; }
        else if(name == "左耳"){ return leftEarY; }
        else if(name == "右耳"){ return rightEarY; }
        else if(name == "左肩"){ return leftShoulderY;}
        else if(name == "右肩"){ return rightShoulderY; }
        else if(name == "左肘"){ return leftElbowY; }
        else if(name == "右肘"){ return rightElbowY; }
        else if(name == "左手首"){ return leftWristY; }
        else if(name == "右手首"){ return rightWristY; }
        else if(name == "左尻"){ return leftHipY; }
        else if(name == "右尻"){ return rightHipY; }
        else if(name == "左膝"){ return leftKneeY; }
        else if(name == "右膝"){ return rightKneeY; }
        else if(name == "左足首"){ return leftAnkleY; }
        else if(name == "右足首"){ return rightAnkleY; }
    }

    whenDetectHuman (args) {
        if(isContainHuman == true){
            isContainHuman = false;
            return true;
        }else{
            return false;
        }
    }

    videoToggle (args) {
        const state = args.VIDEO_STATE;
        this.globalVideoState = state;
        if (state === VideoState.OFF) {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo();
            // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
            this.runtime.ioDevices.video.mirror = state === VideoState.ON;
        }
    }

    setVideoTransparency (args) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        this.globalVideoTransparency = transparency;
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }
}

module.exports = Scratch3TfVideoSensingBlocks;
