/*******************************************
 *              火山PC和JS交互支持
 ********************************************/
import {randomId} from "@/utils/index";
import * as constants from "constants";

const vol_call_results = {}
const vol_js_cbs = {}
const vol_js_events = {}

/**
 * 初始化火山环境
 */
export function volInitEnv() {
    if (!chrome || !chrome.webview) {
        return
    }
    // 监听message事件
    chrome.webview.addEventListener('message', event => {
        const data = event.data
        console.log(event)
        if ('js_event_id' in data) {
            // js执行火山方法的结果
            if (data['result'] === null || data['result'] === undefined) {
                vol_call_results[data['js_event_id']] = {}
            } else {
                vol_call_results[data['js_event_id']] = data['result']
            }
        } else {
            // 火山主动调用js的方法
            TryInvokeJsEvent(data.name, data.params, data.id)
        }
    })
}


/**
 * 调用火山PC的函数，catch为超时
 * @param eventName 事件名
 * @param params 参数，必须是Object
 * @param timeout 等到超时时间s
 */
export function volCall(eventName, params = {}, timeout = 60) {
    return new Promise((resolve, reject) => {
        if (!chrome || !chrome.webview) {
            reject("当前非火山环境")
            return;
        }

        if (params === null || params === undefined) {
            params = {}
        }

        const js_event_id = randomId()
        const data = {
            name: eventName,
            id: js_event_id,
            params: params
        }
        window.chrome.webview.postMessage("invokeVolEvent," + JSON.stringify(data))
        waitVolResult(js_event_id, timeout, resolve, reject)
    })
}


/**
 * 等待调用火山PC方法后的结果
 * @param js_event_id
 * @param timeout
 * @param resolve
 * @param reject
 * @param alreadyWaitTime
 */
function waitVolResult(js_event_id, timeout, resolve, reject, alreadyWaitTime = 0) {
    setTimeout(() => {
        if (js_event_id in vol_call_results) {
            const result = vol_call_results[js_event_id]
            delete vol_call_results[js_event_id]
            if (result['status'] === 0) {
                resolve(result['data'])
            } else if (result['status'] === 1) {
                reject("event not exists")
            }
            return
        }

        alreadyWaitTime += 10
        if (alreadyWaitTime > timeout * 1000) {
            reject("timeout")
        } else {
            waitVolResult(js_event_id, timeout, resolve, reject, alreadyWaitTime)
        }
    }, 10)
}


/**
 * 注册火山可以调用的js事件
 * @param eventName 事件名
 * @param callback 事件回调，要求参数为 object
 * @returns {string} 返回事件id，用于注销事件
 */
export function volRegisterEvent(eventName, callback) {
    if (!eventName in vol_js_events) {
        vol_js_events[eventName] = []
    }

    const eventId = randomId()
    vol_js_events[eventName].push(eventId)
    vol_js_cbs[eventId] = callback
    return eventId
}

/**
 * 注销之前注册的火山可调用的js事件
 * @param eventId 事件id,即 volRegisterEvent 的返回值
 */
export function volUnregisterEvent(eventId) {
    if (eventId in vol_js_cbs) {
        delete vol_js_cbs[eventId];

        for (const eventName in vol_js_events) {
            const eventIds = vol_js_events[eventName];
            const index = eventIds.indexOf(eventId);
            if (index !== -1) {
                eventIds.splice(index, 1);
                if (eventIds.length === 0) {
                    delete vol_js_events[eventName];
                }
                break;
            }
        }
    }
}


function TryInvokeJsEvent(eventName, eventParams, eventCallId) {
    // 判断是否绑定了该事件
    if (!eventName in vol_js_events) {
        return {eventCallId: eventCallId, results: []}
    }

    // 执行事件
    const results = []
    const events = vol_js_events[eventName]
    events.forEach(id => {
        if (id in vol_js_cbs) {
            let result = vol_js_cbs[id](eventParams)
            if (result === null || result === undefined) {
                result = ''
            }
            results.push(result)
        }
    })

    // 响应执行结果
    if (window.chrome === undefined) {
        return;
    }
    window.chrome.webview.postMessage("vol_call_js_result," + JSON.stringify({
        eventCallId: eventCallId,
        results: results
    }))
}