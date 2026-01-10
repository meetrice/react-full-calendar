// English translations
export const en = {
  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    loading: 'Loading...',
    today: 'Today',
    back: 'Back',
    saveChanges: 'Save Changes',
    account: 'Account',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    settings: 'Settings',
    logout: 'Logout',
  },

  // Months
  months: {
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },

  // Weekdays (short)
  weekdays: {
    sunday: 'Sun',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
  },

  // Weekdays (full)
  weekdaysFull: {
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
  },

  // Calendar
  calendar: {
    addEvent: 'Add Event',
    newEvent: 'New event',
    noEvents: 'No events',
    allDay: 'All day',
    previousMonth: 'Previous',
    nextMonth: 'Next',
    views: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      agenda: 'Agenda',
      year: 'Year',
    },
    eventAdded: 'Event "{{title}}" added',
    eventUpdated: 'Event "{{title}}" updated',
    eventDeleted: 'Event "{{title}}" deleted',
    eventMoved: 'Event "{{title}}" moved',
  },

  // Event Dialog
  eventDialog: {
    createEvent: 'Create Event',
    editEvent: 'Edit Event',
    title: 'Title',
    description: 'Description',
    startDate: 'Start Date',
    endDate: 'End Date',
    startTime: 'Start Time',
    endTime: 'End Time',
    allDay: 'All day',
    location: 'Location',
    etiquette: 'Etiquette',
    pickDate: 'Pick a date',
    selectTime: 'Select time',
    noTitle: '(no title)',
    timeValidation: 'Selected time must be between {{min}}:00 and {{max}}:00',
    dateValidation: 'End date cannot be before start date',
    deleteEvent: 'Delete event',
  },

  // Event Colors
  eventColors: {
    sky: 'Sky',
    amber: 'Amber',
    violet: 'Violet',
    rose: 'Rose',
    emerald: 'Emerald',
    orange: 'Orange',
  },

  // Settings Page
  settings: {
    title: 'Settings',
    description: 'Manage your application preferences',
    saved: 'Settings saved successfully',
    saveFailed: 'Failed to save settings. Please try again.',

    // Language Settings
    language: {
      title: 'Language',
      description: 'Select your preferred language for the application',
    },
    languages: {
      en: 'English',
      zh: 'Chinese',
      de: 'German',
      es: 'Spanish',
      fr: 'French',
      ja: 'Japanese',
    },

    // Calendar Settings
    calendar: {
      title: 'Calendar',
      description: 'Customize your calendar view preferences',
      weekStart: {
        title: 'Week Starts On',
        description: 'Choose which day should appear as the first day of the week',
        sunday: 'Sunday',
        monday: 'Monday',
      },
    },

    // Notification Settings
    notifications: {
      title: 'Notifications',
      description: 'Choose how you want to receive notifications',
      browser: {
        title: 'Browser Notifications',
        description: 'Receive notifications directly in your browser',
      },
      api: {
        title: 'API Notifications',
        description: 'Use notification API for custom integrations',
      },
      none: {
        title: 'None',
        description: 'Disable all notifications',
      },
    },
  },

  // Account Settings Page
  account: {
    title: 'Account Settings',
    description: 'Manage your personal information and preferences',
    updated: 'Account updated successfully',
    updateFailed: 'Failed to update account. Please try again.',

    // Profile Photo
    profilePhoto: {
      title: 'Profile Photo',
      description: 'Update your profile picture',
      upload: 'Upload Photo',
      change: 'Change Photo',
      remove: 'Remove',
      error: 'Please select an image file',
      sizeError: 'Image size must be less than 5MB',
      success: 'Photo updated successfully',
      uploadFailed: 'Failed to upload image',
      removed: 'Photo removed',
    },

    // Basic Information
    basicInfo: {
      title: 'Basic Information',
      description: 'Update your personal details',
      username: 'Username',
      email: 'Email',
      firstName: 'First Name',
      lastName: 'Last Name',
      fullName: 'Full Name',
    },
    placeholders: {
      username: 'Enter username',
      email: 'your@email.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      phone: '+1 234 567 8900',
      occupation: 'Software Engineer',
      company: 'Acme Inc.',
    },

    // Contact Information
    contactInfo: {
      title: 'Contact Information',
      description: 'Your contact details',
      phone: 'Phone Number',
    },

    // Work Information
    workInfo: {
      title: 'Work Information',
      description: 'Your professional details',
      occupation: 'Occupation',
      company: 'Company Name',
    },

    // Preferences
    preferences: {
      title: 'Preferences',
      description: 'Customize your experience',
      language: 'Language',
      selectLanguage: 'Select language',
    },
  },
} as const

export type Translations = typeof en
