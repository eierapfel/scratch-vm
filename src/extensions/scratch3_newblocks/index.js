// デフォルト
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');

const WEBVideoViewer = require('./web_video_viewer');
/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+cGVuLWljb248L3RpdGxlPjxnIHN0cm9rZT0iIzU3NUU3NSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04Ljc1MyAzNC42MDJsLTQuMjUgMS43OCAxLjc4My00LjIzN2MxLjIxOC0yLjg5MiAyLjkwNy01LjQyMyA1LjAzLTcuNTM4TDMxLjA2NiA0LjkzYy44NDYtLjg0MiAyLjY1LS40MSA0LjAzMi45NjcgMS4zOCAxLjM3NSAxLjgxNiAzLjE3My45NyA0LjAxNUwxNi4zMTggMjkuNTljLTIuMTIzIDIuMTE2LTQuNjY0IDMuOC03LjU2NSA1LjAxMiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yOS40MSA2LjExcy00LjQ1LTIuMzc4LTguMjAyIDUuNzcyYy0xLjczNCAzLjc2Ni00LjM1IDEuNTQ2LTQuMzUgMS41NDYiLz48cGF0aCBkPSJNMzYuNDIgOC44MjVjMCAuNDYzLS4xNC44NzMtLjQzMiAxLjE2NGwtOS4zMzUgOS4zYy4yODItLjI5LjQxLS42NjguNDEtMS4xMiAwLS44NzQtLjUwNy0xLjk2My0xLjQwNi0yLjg2OC0xLjM2Mi0xLjM1OC0zLjE0Ny0xLjgtNC4wMDItLjk5TDMwLjk5IDUuMDFjLjg0NC0uODQgMi42NS0uNDEgNC4wMzUuOTYuODk4LjkwNCAxLjM5NiAxLjk4MiAxLjM5NiAyLjg1NU0xMC41MTUgMzMuNzc0Yy0uNTczLjMwMi0xLjE1Ny41Ny0xLjc2NC44M0w0LjUgMzYuMzgybDEuNzg2LTQuMjM1Yy4yNTgtLjYwNC41My0xLjE4Ni44MzMtMS43NTcuNjkuMTgzIDEuNDQ4LjYyNSAyLjEwOCAxLjI4Mi42Ni42NTggMS4xMDIgMS40MTIgMS4yODcgMi4xMDIiIGZpbGw9IiM0Qzk3RkYiLz48cGF0aCBkPSJNMzYuNDk4IDguNzQ4YzAgLjQ2NC0uMTQuODc0LS40MzMgMS4xNjVsLTE5Ljc0MiAxOS42OGMtMi4xMyAyLjExLTQuNjczIDMuNzkzLTcuNTcyIDUuMDFMNC41IDM2LjM4bC45NzQtMi4zMTYgMS45MjUtLjgwOGMyLjg5OC0xLjIxOCA1LjQ0LTIuOSA3LjU3LTUuMDFsMTkuNzQzLTE5LjY4Yy4yOTItLjI5Mi40MzItLjcwMi40MzItMS4xNjUgMC0uNjQ2LS4yNy0xLjQtLjc4LTIuMTIyLjI1LjE3Mi41LjM3Ny43MzcuNjE0Ljg5OC45MDUgMS4zOTYgMS45ODMgMS4zOTYgMi44NTYiIGZpbGw9IiM1NzVFNzUiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0xOC40NSAxMi44M2MwIC41LS40MDQuOTA1LS45MDQuOTA1cy0uOTA1LS40MDUtLjkwNS0uOTA0YzAtLjUuNDA3LS45MDMuOTA2LS45MDMuNSAwIC45MDQuNDA0LjkwNC45MDR6IiBmaWxsPSIjNTc1RTc1Ii8+PC9nPjwvc3ZnPg==';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI =  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAACsklEQVR4Xu2bz2vTYBjHn6Q/HK62SmV1Q9DBENnBHQR1Duw8eBIc+Bd4UTYn9qAnYRcR71XmQC/+KROsK2xEpgWPg1LQtGsrNe2sTfOOgqfRJO+TptsC35wKefK+z/N5P3mgbxKFcPQloIBLfwIAY2MGwAAMr2nAGBgzDGM+iBRZ9CgZMecUlUK8KY5HtLCoW+2Ec6TSe3qo6G5Zud9K7zppCoXX3QYK1PmuOU+PI5+ccnYGs2qco/Doz0AVLZus2Ryn5dgvu3BnMG//vKRobEV2rkDFdVqv6MmobW2OYJJrv9eraiIdqIIlk41ZRt5YOjXryZjkWi1XVc/clJwrUGFxq6E1lhJXAeYAAYCxUQJgAIbX4mAMjIExPAIwhscLPQbGwBgeARjD44UeA2NgDI8AjOHxQo+BMTCGRwDG8Hihx8AYGMMjAGN4vNBjYAyM4RGAMTxeA/WYS9mdXF2JH/lDfUGCWqbJq9wlOiYMrfxsyttD/Z2F2fx4q3bd14w8DFYXRHfKYRpxf/9LevSoqmpfvn73BubH/dsbqb36DenZhhRYt4juVUL+glFUbWNrE2AOrlkUYPprDDA2tzfAAAyv88MYGANjeARgDI8XegyMgTE8AjCGx2vQHpNP7dWPftvh2P27Xrj1OfWvMcdbC/+jh7HtEBHKZl7bumaXrePWj5aezl48GX3qf6m8EYcBpt1uvykUChlPYJ5Pjl15cXlim1eG/9HDAKPr+kypVPrmCQwRhV5Pn19evHA263+58iP6DaZSqWSKxeIqEXW9guldd+LuWHx+cTL1YOJ0YkaooUP/vNiwBGX0LkUH2PMVZHWNZnO7vLv7sVar9b4KbjstjexUvbiRHiQikr1GXonDiRT/Yfwlot5vxyOoRbrVNfB5gLFBCDAAw7u7YAyM4RmzD7rXF2VZ3VMVAAAAAElFTkSuQmCC';


/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3NewBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        console.log("hello4");
        var test = Cast.toString('test1');
        log.log(test);
        this.runtime = runtime;
        this._viewer = new WEBVideoViewer();
        var test = Cast.toString('test2');
        log.log(test);
        this._viewer.drawCanvas();
        //this.image = document.createElement("img");
        //this.image.src = "https://enjoynet.co.jp/icon/icon_menherachan01_05.jpg";
        //this.image.id = "sub_img";
        //this.image.style.position = "absolute";
        //this.image.style.left = "1100px";
        //this.image.style.top = "0px";
        //const message = document.getElementById('focus');
        //body.appendChild(this.image);

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'newblocks', // GUIのindex.jsxで指定したextension id
            name: formatMessage({
                id: 'newblocks.categoryName',
                default: 'newblocks'
            }),
            // name: 'New Blocks', // 拡張機能の名前
            //menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // ブロックの配列。入れた順に表示される
            blocks: [
                {
                    // opcode : 保存時にJSONに書き込まれるオペコード。既存のものとかぶらないように注意が必要
                    opcode: 'writeLog',
                    // blockType : ブロックの種類
                    // BlockType.BOOLEAN(真偽ブロック)
                    // BlockType.COMMAND(スタックブロック)
                    // BlockType.HAT(ハットブロック)
                    // BlockType.LOOP(C型ブロック)
                    // BlockType.REPORTER(値ブロック)
                    blockType: BlockType.COMMAND,
                    // text : ブロックの名前。[]の間に英数字を入れると引数になる
                    // text: 'log [TEXT]',
                    text: formatMessage({id: 'newblocks.writeLog', default: 'log[TEXT]'}),
                    // arguments : 引数
                    arguments: {
                        // キー(ここで例:TEXT)は[TEXT]に入れた文字列
                        TEXT: {
                            // type : 引数の種類
                            // ArgumentType.BOOLEAN(真偽ブロック)
                            // ArgumentType.NUMBER(数値入力)
                            // ArgumentType.STRING(文字列入力)
                            type: ArgumentType.STRING,
                            // defaultValue : 初期値
                            defaultValue: 'hello'
                        }
                    }
                },
                {
                    opcode: 'getBrowser',
                    text: 'browser',
                    blockType: BlockType.REPORTER
                }
            ],
            menus: {
            }
        };
    }

    /**
     * Write log.
     * @param {object} args - the block arguments.
     * @property {number} TEXT - the text.
     */
    // オペコード()から始まる。引数がある場合はargs引数のプロパティとして、
    // args.TEXTのように表記すると取得することができる。
    // Castはキャスト規則の実装。toStringは文字列化, toNumberにすると数値化できる
    // 値/真偽ブロックの場合はreturnで値を返却し、それ以外はreturnは不要
    writeLog (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    /**
     * Get the browser.
     * @return {number} - the user agent.
     */
    getBrowser () {
        //var frame_element = document.getElementsByClassName('stage_stage_1fD7k box_box_2jjDp')[0];
        //var scratch_element = document.getElementById('scratch-font-styles');
        //var test = Cast.toString(scratch_element);
        //log.log(test);
        //for(var i = 0; i < frame_element.length; i++){
            /* getElementsTagNameを使う*/
            //findDiv1 = frame_element[i].getElementsByTagName('div');
    
            /* childrenを使って要素の番号を指定する*/
            //findDiv2 = frame_element[i].children[1];
        //}
        /*var canvas = frame_element.getElementsByTagName('canvas')[0];
        canvas.width = 1;
        canvas.height = 1;
        canvas.style.height = "1px";
        canvas.style.width = "1px";
        var test = Cast.toString(canvas.width);
        log.log(test);
        var test = Cast.toString(canvas.height);
        log.log(test);
        var test = Cast.toString(canvas.style);
        log.log(test);
        var test = Cast.toString(canvas.id);
        log.log(test);
        var test = Cast.toString("test1");
        log.log(test);*/
        
        //var context = canvas.getContext('2d');
        /*var image = document.createElement('img');
        //image.src = "http://"+location.hostname +":8080/stream?topic=/image_raw";
        image.src = "https://enjoynet.co.jp/icon/icon_menherachan01_05.jpg";
        image.id = "sub_img";
        image.style.position = "relative";
        image.style.left = "0px";
        image.style.top = "0px";
        //var parent = canvas.parentNode;
        //canvas.prepend(image);
        parent.insertBefore(image,canvas.nextSibling);
        //context.drawImage(image, 0, 0, 370, 320, 0, 0, 960, 720);
        //var test = Cast.toString(context);
        //log.log(test);*/
        this._viewer.restartDrawCanvas();
        return navigator.userAgent;
    }
}

module.exports = Scratch3NewBlocks;