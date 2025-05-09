const ffi = require('ffi-napi')
const path = require('node:path')
const ref = require('ref-napi')
const refArray = require('ref-array-napi')
const log = require('electron-log')
const { send } = require('node:process')

const dllPath = path.join(__dirname, "lib/bin64/kuaishou_ipc.dll");

let GMConfig = {
    ipcPath: ""
}

const IPC_CS_TYPE = {
    CLIENT: 0,
    SERVER: 1,
    UNKNOWN: 2,
}

let mainWindow;

let ipcHandle;
let setDataReceivedCallback;
let voidPtr
let DataReceivedCallback


 //ipc 检查
 function ipcCheck(mainWindow0){
    mainWindow = mainWindow0;
    var commonLineArgs = process.argv;
    var argsMap = new Map();
    var roomCode = "";
    var ipcPath = "";
    var isYun = false;
    var playerType = 0;
    var posWidth = 1080;
    var posHeight = 1920;
    var posArr = [];
    var commenTxt = ""
    var layoutParam = ""
    var payToken = "";
    log.info(`启动参数：${commonLineArgs}`)
    console.log(`启动参数：${commonLineArgs}`)
    for (var index = 0; index < commonLineArgs.length; index++) {
        var element = commonLineArgs[index];
        if (element == "-c" || element == "-pos" || element == "-ipc" || element == "-m" || element == "-ext") {           
            argsMap.set(element, commonLineArgs[index + 1]);
        }              
    }
    log.info(`启动参数argsMap：${argsMap}`)
    roomCode = ""
    if (argsMap.get("-c")) {
        roomCode = argsMap.get("-c");
    }
    log.info(`启动参数roomCode：${roomCode}`)
    if (argsMap.get("-ipc")){
        ipcPath = argsMap.get("-ipc");
    }
    var extData = argsMap.get("-ext");
    if (extData){
        extData = Buffer.from(extData, 'base64').toString();
        extData = JSON.parse(extData);
        if (extData.isAudience && extData.isAudience == true){
            playerType = 1;
        }else{
            playerType = 0;
        }
        if (extData.commenTxt){
            commenTxt = extData.commenTxt;
        }
        if (extData.layoutParam){
            layoutParam = extData.layoutParam;
        }
        if (extData.payToken){
            payToken = extData.payToken;
        }   
    }else{
        playerType = 0;
    }
    var kcr = argsMap.get("-m");
    //isYun = true;
    if (kcr){
        if (kcr == "kcr"){
            isYun = true;
        }else{
            isYun = false;
        }
    }else{
        isYun = false;
    }
    log.info(`--------------pos-------------${argsMap.get("-pos")}`)
    if (argsMap.get("-pos")){
        posArr = argsMap.get("-pos").split(",");
        log.info(`posArr:${posArr}, ${JSON.stringify(posArr)}`)
        posWidth = parseInt(posArr[2]);
        posHeight = parseInt(posArr[3]);
        log.info(`启动参数posWidth:${posWidth},posHeight:${posHeight}`)
    }
    log.info(`IPC 开始初始化`);   
    var initIpc = ffi.Library(dllPath, {InitIpc: ["int", ["string", "int", "int"]],});
    var result = initIpc.InitIpc(ipcPath,ipcPath.length, IPC_CS_TYPE.CLIENT);
    log.info(`IPC 初始化成功${result}`);  
    //result.message = iconv.decode(Buffer.from(result.message, 'binary'), 'utf-8');
    if (result == 0){
                
        //sendCloudLogin();
        // console.log(`IPC 开始注册回调`);
        ipcHandle = ref.refType('void*')//refArray(ref.types.uint);
        voidPtr = ref.refType('void*')//refArray(ref.types.uint);

        setDataReceivedCallback = ffi.Library(dllPath,{
            "SetDataReceivedCallback":[ref.types.void, ['pointer']]
        });
        DataReceivedCallback = ffi.Callback(ref.types.void, ['string', ref.types.uint, 'pointer'], OnDataReceived);
        setDataReceivedCallback.SetDataReceivedCallback(DataReceivedCallback)
    //     setDataReceivedCallback = ffi.Library(dllPath,{
    //         SetDataReceivedCallback:[ref.types.void, 
    //             [
    //                 ffi.Function(ref.types.void, ["string", ref.types.uint, "pointer"]), 
    //                 ref.types.uint
    //             ]
    //     ]
    // });
    //     setDataReceivedCallback.SetDataReceivedCallback(OnDataReceived,ipcHandle)

        // var setConnectedCallback = ffi.Library(dllPath,{SetConnectedCallback:[ref.types.void, [ffi.Function(ref.types.void, 
        //     ["pointer"]), voidPtr]]});
        // setConnectedCallback.SetConnectedCallback(OnConnected,ipcHandle)

        // var setDisconnectCallback = ffi.Library(dllPath,{SetDisconnectCallback:[ref.types.void, [ffi.Function(ref.types.void, 
        //     ["pointer"]), voidPtr]]});
        // setDisconnectCallback.SetDisconnectCallback(OnDisconnect,ipcHandle)

        // var setLogCallback = ffi.Library(dllPath,{SetLogCallback:[ref.types.void, [ffi.Function(ref.types.void, 
        //     ["string", ref.types.uint, "pointer"]), voidPtr]]});
        // setLogCallback.SetLogCallback(OnLog)
        
        log.info(`IPC 开始注册回调完成`);
        //return roomCode,ipcPath,isYun,playerType;
        
    }else{
        console.log(`IPC 初始化失败 result:${result}`);
    }
    return {roomCode,ipcPath,isYun,playerType,commenTxt,layoutParam,payToken,posWidth,posHeight};    
}
// 发送信息
function sendMsg(msgType,msgData){
    var playload = {
        type:msgType,
        data:msgData,
        version:1
    }
    var msg = JSON.stringify(playload);
    log.info(`sendMsg发送IPC消息:${msg}`)
    try {
        var sendMsg = ffi.Library(dllPath,{
            SendData: ["int", ["string","int"]],
        });
        var ret = sendMsg.SendData(msg,msg.length);
        log.info(`sendMsg发送IPC消息结果:${ret}`)
    } catch (e) {
        log.info(`sendMsg Error:${e}`)   
    }
}
// 接受数据
function OnDataReceived(contentPtr, length,ptr){
    
    //var content = JSON.parse(contentPtr);//contentPtr.readCString();
    // if (!contentPtr){
    //     return;
    // }
    // if (ptr == ipcHandle){
    //     parseMsg(contentPtr);
    // }
    let str = Buffer.from(contentPtr, 'utf8').subarray(0, length).toString()
    log.info(`收到IPC消息OnDataReceived:${str}`)
    parseMsg(str);
    console.log("OnDataReceived")
}
// 连接成功
function OnConnected(ptr){
    //console.log("ipc call OnConnected")
    if (ptr == ipcHandle){
        console.log("OnConnected")  
        isConnect = true;    
    }
}
// 断开连接
function OnDisconnect(ptr){
    if (ptr == ipcHandle){
        console.log("OnDisconnect")  
        isConnect = false;        
    }
}
// 日志
function OnLog(contentPtr,len,ptr){
    var content = JSON.parse(contentPtr);
    console.log(content);
}
//释放ipc
function releaseIPC(){
    var initIpc = ffi.Library(dllPath,"ReleaseIpc");
    initIpc.ReleaseIpc();
}
function parseMsg(msg){
    //msg=msg.replace(/[^\x20-\x7E\u4E00-\u9FFF]+/g, "");
    
    var msgMap = null;
    try {
        msgMap = JSON.parse(msg);
        log.info(`解析IPC消息:${JSON.stringify(msgMap)}`)
    } catch (e) {
        log.info(`parseMsg解析IPC消息异常:${e}`)
    }
    if (msgMap){
        var msgType = msgMap.type;
        switch (msgType){
            case "SC_SET_CODE":
                if (msgMap.data){
                    var code =msgMap.data.code;
                    // 给服务器更新
                    log.info(`收到RoomCode:${code}`)
                    mainWindow.webContents.send('update_room_code',code)
                }                
            break;
            case "SC_QUIT":
                // 退出
                //releaseIPC();
            break;
        }
    }
}

module.exports = {
    ipcCheck,
}