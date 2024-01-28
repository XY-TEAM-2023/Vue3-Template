import { createApp, h } from 'vue'
import ElDialogTip from './Inner_DialogTip.vue'
import ElDialogInput from './Inner_DialogInput.vue'
import ElDialogInputInteger from './Inner_DialogInputInteger.vue'
import ElDialogInputFloat from './Inner_DialogInputFloat.vue'
import ElDialogInputTimestamp from './Inner_DialogInputTimestamp.vue'
import DialogQRcode from './Inner_DialogQRcode.vue'
import i18n from '@/i18n'

class Dialog {
  static currentId = 0
  static dialogs = new Map()

  static Close(dialogId) {
    const dialog = this.dialogs.get(dialogId)
    if (dialog) {
      dialog.app.unmount()
      document.body.removeChild(dialog.mountNode)
      this.dialogs.delete(dialogId)
    }
  }

  static closeAllDialogs() {
    this.dialogs.forEach((_, dialogId) => {
      this.Close(dialogId)
    })
  }

  /**
   * 创建一个可以输入内容的对话框
   * @param content 显示内容
   * @param width 对话框的宽度
   * @param displayCancelBtn 是否显示取消按钮
   * @param onClose 点击关闭按钮回调
   * @param onSubmit 点击提交按钮回调，function(string value)
   * @returns {number} 返回对话框唯一ID
   */
  static tip({ content, width = '300', displayCancelBtn = false, onClose, onSubmit }) {
    const dialogId = ++this.currentId // 先递增 ID，再使用
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    const closeCb = () => {
      Dialog.Close(dialogId)
    }

    const app = createApp({
      render() {
        return h(ElDialogTip, {
          isShow: true,
          content: content ? content : '',
          displayCancelBtn: displayCancelBtn,
          width: width ? width + '' : '400',
          onClose: () => {
            onClose && onClose()
            closeCb()
          },
          onSubmit: () => {
            onSubmit && onSubmit()
            closeCb()
          },
        })
      },
    })

    app.use(i18n)
    app.mount(mountNode)
    this.dialogs.set(dialogId, { app, mountNode })
    return dialogId
  }

  /**
   * 创建一个可以输入内容的对话框
   * @param title 标题，可以直接写国际化的键
   * @param width 对话框的宽度
   * @param defaultValue 输入框默认值
   * @param placeholder 输入框提示文本
   * @param maxLength 输入文本最大长度
   * @param showWordLimit 是否显示字数限制
   * @param clearable 是否显示清空按钮
   * @param onClose 点击关闭按钮回调
   * @param onSubmit 点击提交按钮回调，function(value, cancelCb, closeCb)
   * @returns {number} 返回对话框唯一ID
   */
  static input({
    title,
    width = '300',
    defaultValue = '',
    placeholder = '',
    maxLength = '',
    showWordLimit = false,
    clearable = true,
    onClose,
    onSubmit,
  }) {
    const dialogId = ++this.currentId // 先递增 ID，再使用
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    const closeCb = () => {
      Dialog.Close(dialogId)
    }

    const app = createApp({
      render() {
        return h(ElDialogInput, {
          isShow: true,
          title: title ? title : '',
          width: width ? width + '' : '300',
          defaultValue,
          placeholder,
          maxLength: maxLength ? undefined : maxLength + '',
          showWordLimit,
          clearable,
          onClose: () => {
            onClose && onClose()
            closeCb()
          },
          onSubmit: (newValue, cancelCb) => {
            onSubmit && onSubmit(newValue, cancelCb, closeCb)
          },
        })
      },
    })

    app.use(i18n)
    app.mount(mountNode)
    this.dialogs.set(dialogId, { app, mountNode })
    return dialogId
  }

  /**
   * 创建一个可以输入整数的对话框
   * @param title 标题，可以直接写国际化的键
   * @param width 对话框的宽度
   * @param defaultValue 输入框默认值
   * @param placeholder 输入框提示文本
   * @param clearable 是否显示清空按钮
   * @param onClose 点击关闭按钮回调
   * @param onSubmit 点击提交按钮回调，function(string value)
   * @returns {number} 返回对话框唯一ID
   */
  static inputInteger({ title, width = '300', defaultValue = undefined, placeholder = '', clearable = true, onClose, onSubmit }) {
    const dialogId = ++this.currentId // 先递增 ID，再使用
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    const closeCb = () => {
      Dialog.Close(dialogId)
    }

    const app = createApp({
      render() {
        return h(ElDialogInputInteger, {
          isShow: true,
          title: title ? title : '',
          width: width ? width + '' : '300',
          defaultValue,
          placeholder,
          clearable,
          onClose: () => {
            onClose && onClose()
            closeCb()
          },
          onSubmit: (newValue, cancelCb) => {
            onSubmit && onSubmit(newValue, cancelCb, closeCb)
          },
        })
      },
    })

    app.use(i18n)
    app.mount(mountNode)
    this.dialogs.set(dialogId, { app, mountNode })
    return dialogId
  }

  /**
   * 创建一个可以输入小数的对话框
   * @param title 标题，可以直接写国际化的键
   * @param width 对话框的宽度
   * @param defaultValue 输入框默认值
   * @param placeholder 输入框提示文本
   * @param clearable 是否显示清空按钮
   * @param onClose 点击关闭按钮回调
   * @param onSubmit 点击提交按钮回调，function(string value)
   * @returns {number} 返回对话框唯一ID
   */
  static inputFloat({ title, width = '300', defaultValue = undefined, placeholder = '', clearable = true, onClose, onSubmit }) {
    const dialogId = ++this.currentId // 先递增 ID，再使用
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    const closeCb = () => {
      Dialog.Close(dialogId)
    }

    const app = createApp({
      render() {
        return h(ElDialogInputFloat, {
          isShow: true,
          title: title ? title : '',
          width: width ? width + '' : '300',
          defaultValue,
          placeholder,
          clearable,
          onClose: () => {
            onClose && onClose()
            closeCb()
          },
          onSubmit: (newValue, cancelCb) => {
            onSubmit && onSubmit(newValue, cancelCb, closeCb)
          },
        })
      },
    })

    app.use(i18n)
    app.mount(mountNode)
    this.dialogs.set(dialogId, { app, mountNode })
    return dialogId
  }

  /**
   * 创建一个可以选择时间戳的对话框
   * @param title 标题，可以直接写国际化的键
   * @param width 对话框的宽度
   * @param defaultValue 输入框默认值
   * @param placeholder 输入框提示文本
   * @param clearable 是否显示清空按钮
   * @param onClose 点击关闭按钮回调
   * @param onSubmit 点击提交按钮回调，function(string value)
   * @returns {number} 返回对话框唯一ID
   */
  static inputTimestamp({ title, width = '300', defaultValue = undefined, placeholder = '', clearable = true, onClose, onSubmit }) {
    const dialogId = ++this.currentId // 先递增 ID，再使用
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    const closeCb = () => {
      Dialog.Close(dialogId)
    }

    const app = createApp({
      render() {
        return h(ElDialogInputTimestamp, {
          isShow: true,
          title: title ? title : '',
          width: width ? width + '' : '300',
          defaultValue,
          placeholder,
          clearable,
          onClose: () => {
            onClose && onClose()
            closeCb()
          },
          onSubmit: (newValue, cancelCb) => {
            onSubmit && onSubmit(newValue, cancelCb, closeCb)
          },
        })
      },
    })

    app.use(i18n)
    app.mount(mountNode)
    this.dialogs.set(dialogId, { app, mountNode })
    return dialogId
  }

  /**
   * 创建一个可以选择时间戳的对话框
   * @param title 标题，可以直接写国际化的键
   * @param content 二维码内容
   * @param desc 二维码下方的描述性文本
   * @param width 对话框的宽度
   * @param submitBtnLabel 提交按钮文本
   * @param onClose 点击关闭按钮回调
   * @param onSubmit 点击提交按钮回调，function(cancelCb, closeCb)
   * @returns {number} 返回对话框唯一ID
   */
  static QRCode({ title, content, desc, width = '280', submitBtnLabel, onClose, onSubmit }) {
    const dialogId = ++this.currentId // 先递增 ID，再使用
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    const closeCb = () => {
      Dialog.Close(dialogId)
    }

    const app = createApp({
      render() {
        return h(DialogQRcode, {
          isShow: true,
          title: title ? title : '',
          content: content ? content : '',
          desc: desc,
          submitBtnLabel: submitBtnLabel,
          width: width ? width + '' : '280',
          onClose: () => {
            onClose && onClose()
            closeCb()
          },
          onSubmit: (cancelCb) => {
            onSubmit && onSubmit(cancelCb, closeCb)
          },
        })
      },
    })

    app.use(i18n)
    app.mount(mountNode)
    this.dialogs.set(dialogId, { app, mountNode })
    return dialogId
  }
}

export default Dialog
