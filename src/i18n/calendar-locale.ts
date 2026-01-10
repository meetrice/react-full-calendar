import { Locale } from 'date-fns'
import { enUS, zhCN } from 'date-fns/locale'
import type { LanguageCode } from '@/auth/lib/models'

// Get date-fns locale by language code
export function getDateLocale(lang: LanguageCode): Locale {
  const localeMap: Record<LanguageCode, Locale> = {
    en: enUS,
    zh: zhCN,
    de: enUS, // fallback to English
    es: enUS,
    fr: enUS,
    ja: enUS,
  }
  return localeMap[lang] || enUS
}

// Get month names by language
export function getMonthNames(lang: LanguageCode): string[] {
  const months: Record<LanguageCode, string[]> = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  }
  return months[lang] || months.en
}

// Get weekday names (short) by language
export function getWeekdayNamesShort(lang: LanguageCode, weekStart: 'sunday' | 'monday' = 'sunday'): string[] {
  const weekdays: Record<LanguageCode, string[]> = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    zh: ['日', '一', '二', '三', '四', '五', '六'],
    de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    ja: ['日', '月', '火', '水', '木', '金', '土'],
  }

  const days = weekdays[lang] || weekdays.en

  // Adjust order based on week start
  if (weekStart === 'monday') {
    return [days[1], days[2], days[3], days[4], days[5], days[6], days[0]]
  }
  return days
}

// Get weekday names (full) by language
export function getWeekdayNamesFull(lang: LanguageCode): string[] {
  const weekdays: Record<LanguageCode, string[]> = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    zh: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    ja: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  }
  return weekdays[lang] || weekdays.en
}
