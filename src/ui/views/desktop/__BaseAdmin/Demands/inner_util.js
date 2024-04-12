function generateUniqueID() {
  return Date.now().toString(36) + Math.random().toString(36).slice(-5)
}

export function newRule() {
  return {
    tag: generateUniqueID(), // 唯一标识
    type: 'rule',
    match: 'AND', // AND、OR
    field_id: '',
    field_name: '', // 最终需要移除
    field_desc: '', // 最终需要移除
    check: '', // > < >= ...
    check_val: '', // 值
  }
}

export function newGroup() {
  return {
    tag: generateUniqueID(), // 唯一标识
    type: 'group',
    match: 'AND', // AND、OR
    children: [],
  }
}

export function newModule() {
  return {
    tag: generateUniqueID(), // 唯一标识
    type: 'module',
    path_id: [], // [页面id,方案id,模块id]
    match: 'AND', // AND、OR
  }
}