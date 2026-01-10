// Chinese translations
export const zh = {
  // Common
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    close: '关闭',
    loading: '加载中...',
    today: '今天',
    back: '返回',
    saveChanges: '保存更改',
    account: '账号',
    darkMode: '深色模式',
    lightMode: '浅色模式',
    settings: '设置',
    logout: '退出登录',
  },

  // Months
  months: {
    january: '一月',
    february: '二月',
    march: '三月',
    april: '四月',
    may: '五月',
    june: '六月',
    july: '七月',
    august: '八月',
    september: '九月',
    october: '十月',
    november: '十一月',
    december: '十二月',
  },

  // Weekdays (short)
  weekdays: {
    sunday: '日',
    monday: '一',
    tuesday: '二',
    wednesday: '三',
    thursday: '四',
    friday: '五',
    saturday: '六',
  },

  // Weekdays (full)
  weekdaysFull: {
    sunday: '星期日',
    monday: '星期一',
    tuesday: '星期二',
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
  },

  // Calendar
  calendar: {
    addEvent: '添加事件',
    newEvent: '新建事件',
    noEvents: '暂无事件',
    allDay: '全天',
    previousMonth: '上一月',
    nextMonth: '下一月',
    views: {
      month: '月',
      week: '周',
      day: '日',
      agenda: '日程',
      year: '年',
    },
    eventAdded: '已添加事件 "{{title}}"',
    eventUpdated: '已更新事件 "{{title}}"',
    eventDeleted: '已删除事件 "{{title}}"',
    eventMoved: '已移动事件 "{{title}}"',
  },

  // Event Dialog
  eventDialog: {
    createEvent: '创建事件',
    editEvent: '编辑事件',
    title: '标题',
    description: '描述',
    startDate: '开始日期',
    endDate: '结束日期',
    startTime: '开始时间',
    endTime: '结束时间',
    allDay: '全天',
    location: '位置',
    etiquette: '标签',
    pickDate: '选择日期',
    selectTime: '选择时间',
    noTitle: '(无标题)',
    timeValidation: '选择时间必须在 {{min}}:00 到 {{max}}:00 之间',
    dateValidation: '结束日期不能早于开始日期',
    deleteEvent: '删除事件',
  },

  // Event Colors
  eventColors: {
    sky: '天空蓝',
    amber: '琥珀色',
    violet: '紫罗兰',
    rose: '玫瑰红',
    emerald: '翡翠绿',
    orange: '橙色',
  },

  // Settings Page
  settings: {
    title: '设置',
    description: '管理您的应用偏好',
    saved: '设置保存成功',
    saveFailed: '保存设置失败，请重试。',

    // Language Settings
    language: {
      title: '语言',
      description: '选择您的首选语言',
    },
    languages: {
      en: 'English',
      zh: '中文',
      de: '德语',
      es: '西班牙语',
      fr: '法语',
      ja: '日语',
    },

    // Calendar Settings
    calendar: {
      title: '日历',
      description: '自定义日历视图偏好',
      weekStart: {
        title: '每周开始于',
        description: '选择每周的第一天显示为哪一天',
        sunday: '星期日',
        monday: '星期一',
      },
    },

    // Notification Settings
    notifications: {
      title: '通知',
      description: '选择您希望接收通知的方式',
      browser: {
        title: '浏览器通知',
        description: '直接在浏览器中接收通知',
      },
      api: {
        title: 'API 通知',
        description: '使用通知 API 进行自定义集成',
      },
      none: {
        title: '无',
        description: '禁用所有通知',
      },
    },
  },

  // Account Settings Page
  account: {
    title: '账号设置',
    description: '管理您的个人信息和偏好',
    updated: '账号更新成功',
    updateFailed: '账号更新失败，请重试。',

    // Profile Photo
    profilePhoto: {
      title: '个人头像',
      description: '更新您的头像',
      upload: '上传头像',
      change: '更改头像',
      remove: '移除',
      error: '请选择图片文件',
      sizeError: '图片大小必须小于 5MB',
      success: '头像更新成功',
      uploadFailed: '头像上传失败',
      removed: '头像已移除',
    },

    // Basic Information
    basicInfo: {
      title: '基本信息',
      description: '更新您的个人详细信息',
      username: '用户名',
      email: '邮箱',
      firstName: '名',
      lastName: '姓',
      fullName: '全名',
    },
    placeholders: {
      username: '输入用户名',
      email: 'your@email.com',
      firstName: '张',
      lastName: '三',
      fullName: '张三',
      phone: '+86 138 0000 0000',
      occupation: '软件工程师',
      company: '某某公司',
    },

    // Contact Information
    contactInfo: {
      title: '联系信息',
      description: '您的联系方式',
      phone: '电话号码',
    },

    // Work Information
    workInfo: {
      title: '工作信息',
      description: '您的职业详细信息',
      occupation: '职业',
      company: '公司名称',
    },

    // Preferences
    preferences: {
      title: '偏好设置',
      description: '自定义您的体验',
      language: '语言',
      selectLanguage: '选择语言',
    },
  },
} as const

export type Translations = typeof zh
