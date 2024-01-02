import { createApp, h } from 'vue'
import ElDialogInput from './Inner_DialogInput.vue'
import i18n from '@/i18n'

class Dialog {
  static currentId = 0
  static dialogs = new Map()

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
   * @param onSubmit 点击提交按钮回调，function(string value)
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
          maxLength,
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
}

export default Dialog
