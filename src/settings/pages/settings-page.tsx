import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/auth"
import { useT } from "@/i18n"
import { toast } from "sonner"
import { Loader2, Globe, Calendar, Bell, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LanguageCode, WeekStartDay, NotificationMethod } from "@/auth/lib/models"

export function SettingsPage() {
  const { user, updateProfile, getUser, setUser } = useAuth()
  const { t } = useT()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Settings state
  const [language, setLanguage] = useState<LanguageCode>(user?.language || 'en')
  const [weekStart, setWeekStart] = useState<WeekStartDay>(user?.week_start || 'sunday')
  const [notificationMethod, setNotificationMethod] = useState<NotificationMethod>(user?.notification_method || 'browser')

  // Refresh user data from Supabase on mount
  useEffect(() => {
    const refreshUser = async () => {
      setIsRefreshing(true)
      const freshUser = await getUser(true)
      if (freshUser) {
        setUser(freshUser)
      }
      setIsRefreshing(false)
    }
    refreshUser()
  }, [])

  useEffect(() => {
    if (user && !isRefreshing) {
      setLanguage(user.language || 'en')
      setWeekStart(user.week_start || 'sunday')
      setNotificationMethod(user.notification_method || 'browser')
    }
  }, [user, isRefreshing])

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await updateProfile({
        ...user,
        language,
        week_start: weekStart,
        notification_method: notificationMethod,
      })

      toast.success(t('settings.saved'))
    } catch (error) {
      toast.error(t('settings.saveFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const languages = [
    { code: 'en' as const, name: 'English', nativeName: 'English' },
    { code: 'zh' as const, name: 'Chinese', nativeName: '中文' },
    { code: 'de' as const, name: 'German', nativeName: 'Deutsch' },
    { code: 'es' as const, name: 'Spanish', nativeName: 'Español' },
    { code: 'fr' as const, name: 'French', nativeName: 'Français' },
    { code: 'ja' as const, name: 'Japanese', nativeName: '日本語' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBack} className="mb-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button onClick={handleSave} disabled={isLoading} className="gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {t('common.saveChanges')}
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('settings.description')}
        </p>
      </div>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('settings.language.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.language.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={language} onValueChange={(value) => setLanguage(value as LanguageCode)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                    language === lang.code
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setLanguage(lang.code)}
                >
                  <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} />
                  <Label htmlFor={`lang-${lang.code}`} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-muted-foreground text-sm">{lang.nativeName}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Calendar Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('settings.calendar.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.calendar.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">{t('settings.calendar.weekStart.title')}</Label>
              <p className="text-sm text-muted-foreground mb-3">
                {t('settings.calendar.weekStart.description')}
              </p>
              <RadioGroup value={weekStart} onValueChange={(value) => setWeekStart(value as WeekStartDay)}>
                <div className="flex flex-col gap-2">
                  <div className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                    weekStart === 'sunday'
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted'
                  }`}>
                    <RadioGroupItem value="sunday" id="week-sunday" />
                    <Label htmlFor="week-sunday" className="flex-1 cursor-pointer">
                      <span className="font-medium">{t('settings.calendar.weekStart.sunday')}</span>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                    weekStart === 'monday'
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted'
                  }`}>
                    <RadioGroupItem value="monday" id="week-monday" />
                    <Label htmlFor="week-monday" className="flex-1 cursor-pointer">
                      <span className="font-medium">{t('settings.calendar.weekStart.monday')}</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('settings.notifications.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.notifications.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={notificationMethod} onValueChange={(value) => setNotificationMethod(value as NotificationMethod)}>
            <div className="flex flex-col gap-2">
              <div className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                notificationMethod === 'browser'
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-muted'
              }`}>
                <RadioGroupItem value="browser" id="notif-browser" />
                <Label htmlFor="notif-browser" className="flex-1 cursor-pointer">
                  <div>
                    <span className="font-medium">{t('settings.notifications.browser.title')}</span>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notifications.browser.description')}
                    </p>
                  </div>
                </Label>
              </div>
              <div className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                notificationMethod === 'api'
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-muted'
              }`}>
                <RadioGroupItem value="api" id="notif-api" />
                <Label htmlFor="notif-api" className="flex-1 cursor-pointer">
                  <div>
                    <span className="font-medium">{t('settings.notifications.api.title')}</span>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notifications.api.description')}
                    </p>
                  </div>
                </Label>
              </div>
              <div className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                notificationMethod === 'none'
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-muted'
              }`}>
                <RadioGroupItem value="none" id="notif-none" />
                <Label htmlFor="notif-none" className="flex-1 cursor-pointer">
                  <div>
                    <span className="font-medium">{t('settings.notifications.none.title')}</span>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notifications.none.description')}
                    </p>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}
