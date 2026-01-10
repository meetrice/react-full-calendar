import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/auth"
import { useT } from "@/i18n"
import { toast } from "sonner"
import { Loader2, User, Mail, Phone, Building2, ArrowLeft, Camera, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LanguageCode } from "@/auth/lib/models"
import { getInitials } from "@/lib/helpers"

export function AccountPage() {
  const { user, updateProfile, getUser, setUser } = useAuth()
  const { t } = useT()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Form state
  const [username, setUsername] = useState(user?.username || '')
  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [fullName, setFullName] = useState(user?.fullname || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [occupation, setOccupation] = useState(user?.occupation || '')
  const [companyName, setCompanyName] = useState(user?.company_name || '')
  const [language, setLanguage] = useState<LanguageCode>(user?.language || 'en')
  const [pic, setPic] = useState(user?.pic || '')

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
      setUsername(user.username || '')
      setFirstName(user.first_name || '')
      setLastName(user.last_name || '')
      setFullName(user.fullname || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
      setOccupation(user.occupation || '')
      setCompanyName(user.company_name || '')
      setLanguage(user.language || 'en')
      setPic(user.pic || '')
    }
  }, [user, isRefreshing])

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await updateProfile({
        ...user,
        username,
        first_name: firstName,
        last_name: lastName,
        fullname: fullName,
        email,
        phone,
        occupation,
        company_name: companyName,
        language,
        pic,
      })

      toast.success(t('account.updated'))
    } catch (error) {
      toast.error(t('account.updateFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t('account.profilePhoto.error'))
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('account.profilePhoto.sizeError'))
      return
    }

    setIsUploading(true)
    try {
      // Convert to base64 for storage (in production, upload to server/storage service)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPic(reader.result as string)
        setIsUploading(false)
        toast.success(t('account.profilePhoto.success'))
      }
      reader.onerror = () => {
        setIsUploading(false)
        toast.error(t('account.profilePhoto.uploadFailed'))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setIsUploading(false)
      toast.error(t('account.profilePhoto.uploadFailed'))
    }
  }

  const handleRemovePhoto = () => {
    setPic('')
    toast.success(t('account.profilePhoto.removed'))
  }

  const languages = [
    { code: 'en' as const, name: 'English' },
    { code: 'zh' as const, name: 'Chinese' },
    { code: 'de' as const, name: 'German' },
    { code: 'es' as const, name: 'Spanish' },
    { code: 'fr' as const, name: 'French' },
    { code: 'ja' as const, name: 'Japanese' },
  ]

  // Get user display name
  const displayName = fullName || `${firstName} ${lastName}`.trim() || username || 'User'
  const initials = getInitials(displayName, 2)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBack}>
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
        <h1 className="text-2xl font-bold text-foreground">{t('account.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('account.description')}
        </p>
      </div>

      {/* Profile Photo Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('account.profilePhoto.title')}</CardTitle>
          <CardDescription>
            {t('account.profilePhoto.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              {pic ? (
                <AvatarImage src={pic} alt={displayName} />
              ) : null}
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                {pic ? t('account.profilePhoto.change') : t('account.profilePhoto.upload')}
              </Button>
              {pic && (
                <Button
                  variant="ghost"
                  onClick={handleRemovePhoto}
                  disabled={isUploading}
                >
                  {t('account.profilePhoto.remove')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('account.basicInfo.title')}
          </CardTitle>
          <CardDescription>
            {t('account.basicInfo.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('account.basicInfo.username')}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('account.placeholders.username')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('account.basicInfo.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('account.placeholders.email')}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">{t('account.basicInfo.firstName')}</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('account.placeholders.firstName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{t('account.basicInfo.lastName')}</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('account.placeholders.lastName')}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fullName">{t('account.basicInfo.fullName')}</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('account.placeholders.fullName')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t('account.contactInfo.title')}
          </CardTitle>
          <CardDescription>
            {t('account.contactInfo.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">{t('account.contactInfo.phone')}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('account.placeholders.phone')}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t('account.workInfo.title')}
          </CardTitle>
          <CardDescription>
            {t('account.workInfo.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation">{t('account.workInfo.occupation')}</Label>
              <Input
                id="occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder={t('account.placeholders.occupation')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">{t('account.workInfo.company')}</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={t('account.placeholders.company')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>{t('account.preferences.title')}</CardTitle>
          <CardDescription>
            {t('account.preferences.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">{t('account.preferences.language')}</Label>
            <Select value={language} onValueChange={(value) => setLanguage(value as LanguageCode)}>
              <SelectTrigger id="language">
                <SelectValue placeholder={t('account.preferences.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
