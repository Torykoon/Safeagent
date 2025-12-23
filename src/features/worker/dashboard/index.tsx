import { useState, useEffect } from 'react'
import {
    Cloud,
    Sun,
    CloudRain,
    Snowflake,
    Thermometer,
    Droplets,
    Wind,
    Clock,
    AlertTriangle,
    ClipboardList,
    Globe,
    Bell,
    ShieldCheck,
    MapPin,
    ChevronRight,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

import {
    type Language,
    SUPPORTED_LANGUAGES,
    translations,
    mockWeather,
    mockRiskFactors,
    mockTasks,
    mockNotice,
    mockSafetyTips,
} from './data/worker-dashboard-data'

// ----------------------------------------------------------------------
// Worker 대시보드 메인 컴포넌트
// ----------------------------------------------------------------------

export function WorkerDashboard() {
    const [language, setLanguage] = useState<Language>('ko')
    const [currentTime, setCurrentTime] = useState(new Date())
    const t = translations[language]

    // 시간 업데이트 (1초마다)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // 날씨 아이콘 선택
    const WeatherIcon = {
        sunny: Sun,
        cloudy: Cloud,
        rainy: CloudRain,
        snowy: Snowflake,
    }[mockWeather.condition]

    // 날짜 포맷
    const formatDate = () => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
        const locale = {
            ko: 'ko-KR',
            en: 'en-US',
            zh: 'zh-CN',
            vi: 'vi-VN',
        }[language]
        return currentTime.toLocaleDateString(locale, options)
    }

    // 시간 포맷
    const formatTime = () => {
        return currentTime.toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
    }

    // 위험 등급 스타일
    const getRiskBadgeStyle = (level: 'high' | 'medium' | 'low') => {
        switch (level) {
            case 'high':
                return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
            case 'medium':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
            case 'low':
                return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30'
        }
    }

    const getRiskLabel = (level: 'high' | 'medium' | 'low') => {
        switch (level) {
            case 'high':
                return t.highRisk
            case 'medium':
                return t.mediumRisk
            case 'low':
                return t.lowRisk
        }
    }

    return (
        <>
            <Header fixed>
                <div className='flex w-full items-center justify-between gap-4 px-4'>
                    <div className='flex items-center gap-3'>
                        <ShieldCheck className='h-6 w-6 text-primary' />
                        <h1 className='text-xl font-bold tracking-tight'>{t.dashboard}</h1>
                    </div>
                    <div className='flex items-center gap-3'>
                        {/* 언어 선택 */}
                        <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
                            <SelectTrigger className='w-[140px] h-9'>
                                <Globe className='h-4 w-4 mr-2 text-muted-foreground' />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <SelectItem key={lang.code} value={lang.code}>
                                        <span className='flex items-center gap-2'>
                                            <span>{lang.flag}</span>
                                            <span>{lang.name}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <ThemeSwitch />
                        <ProfileDropdown />
                    </div>
                </div>
            </Header>

            <Main fixed>
                <div className='p-6 space-y-6 h-full overflow-y-auto'>
                    {/* Row 1: 시간 & 날씨 */}
                    <div className='grid gap-4 md:grid-cols-2'>
                        {/* 현재 시간 위젯 */}
                        <Card className='bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'>
                            <CardContent className='p-6'>
                                <div className='flex items-center gap-3 mb-3'>
                                    <Clock className='h-5 w-5 text-primary' />
                                    <span className='text-sm font-medium text-muted-foreground'>{t.currentTime}</span>
                                </div>
                                <div className='text-4xl font-bold tracking-tight mb-2'>
                                    {formatTime()}
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                    {formatDate()}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 날씨 위젯 */}
                        <Card>
                            <CardContent className='p-6'>
                                <div className='flex items-center gap-3 mb-3'>
                                    <WeatherIcon className='h-5 w-5 text-sky-500' />
                                    <span className='text-sm font-medium text-muted-foreground'>{t.weather}</span>
                                </div>
                                <div className='grid grid-cols-3 gap-4'>
                                    <div className='text-center'>
                                        <Thermometer className='h-5 w-5 mx-auto mb-1 text-orange-500' />
                                        <div className='text-2xl font-bold'>{mockWeather.temperature}°C</div>
                                        <div className='text-xs text-muted-foreground'>{t.temperature}</div>
                                    </div>
                                    <div className='text-center'>
                                        <Droplets className='h-5 w-5 mx-auto mb-1 text-blue-500' />
                                        <div className='text-2xl font-bold'>{mockWeather.humidity}%</div>
                                        <div className='text-xs text-muted-foreground'>{t.humidity}</div>
                                    </div>
                                    <div className='text-center'>
                                        <Wind className='h-5 w-5 mx-auto mb-1 text-teal-500' />
                                        <div className='text-2xl font-bold'>{mockWeather.windSpeed}m/s</div>
                                        <div className='text-xs text-muted-foreground'>{t.windSpeed}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Row 2: 긴급 공지사항 */}
                    <Card className='border-amber-500/50 bg-amber-500/5'>
                        <CardContent className='p-4'>
                            <div className='flex items-start gap-3'>
                                <div className='p-2 rounded-full bg-amber-500/10'>
                                    <Bell className='h-5 w-5 text-amber-500' />
                                </div>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <Badge variant='outline' className='bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs'>
                                            {t.urgentNotice}
                                        </Badge>
                                    </div>
                                    <h3 className='font-semibold text-base mb-1'>
                                        {mockNotice.title[language]}
                                    </h3>
                                    <p className='text-sm text-muted-foreground'>
                                        {mockNotice.content[language]}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Row 3: 위험요인 & 작업 */}
                    <div className='grid gap-4 lg:grid-cols-2'>
                        {/* 치명적 위험요인 */}
                        <Card className='border-red-500/30'>
                            <CardHeader className='pb-3'>
                                <CardTitle className='flex items-center gap-2 text-base'>
                                    <AlertTriangle className='h-5 w-5 text-red-500' />
                                    {t.criticalRisk}
                                </CardTitle>
                                <CardDescription className='text-xs'>
                                    {t.criticalRiskDesc}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-3'>
                                {mockRiskFactors.map((risk) => (
                                    <div
                                        key={risk.id}
                                        className='p-4 rounded-lg bg-muted/50 border border-border/50 hover:border-red-500/30 transition-colors'
                                    >
                                        <div className='flex items-start gap-3'>
                                            <span className='text-2xl'>{risk.icon}</span>
                                            <div className='flex-1'>
                                                <div className='flex items-center justify-between mb-1'>
                                                    <h4 className='font-semibold text-sm'>
                                                        {risk.title[language]}
                                                    </h4>
                                                    <Badge
                                                        variant='outline'
                                                        className={`text-xs ${getRiskBadgeStyle(risk.level)}`}
                                                    >
                                                        {getRiskLabel(risk.level)}
                                                    </Badge>
                                                </div>
                                                <p className='text-xs text-muted-foreground'>
                                                    {risk.description[language]}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* 오늘 수행할 작업 */}
                        <Card>
                            <CardHeader className='pb-3'>
                                <CardTitle className='flex items-center gap-2 text-base'>
                                    <ClipboardList className='h-5 w-5 text-primary' />
                                    {t.todayTasks}
                                </CardTitle>
                                <CardDescription className='text-xs'>
                                    {t.todayTasksDesc}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-2'>
                                    {mockTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className='flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors group'
                                        >
                                            <div className='w-16 text-sm font-medium text-primary'>
                                                {task.time.split(' - ')[0]}
                                            </div>
                                            <div className='flex-1'>
                                                <div className='font-medium text-sm'>
                                                    {task.title[language]}
                                                </div>
                                                <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                                    <MapPin className='h-3 w-3' />
                                                    {task.location}
                                                </div>
                                            </div>
                                            <ChevronRight className='h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Row 4: 안전 수칙 */}
                    <Card className='bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-green-500/20'>
                        <CardHeader className='pb-3'>
                            <CardTitle className='flex items-center gap-2 text-base'>
                                <ShieldCheck className='h-5 w-5 text-green-500' />
                                {t.safetyTipTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-3 md:grid-cols-2'>
                                {mockSafetyTips.map((tip, index) => (
                                    <div
                                        key={tip.id}
                                        className='flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-green-500/10'
                                    >
                                        <div className='flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 text-green-500 text-sm font-bold'>
                                            {index + 1}
                                        </div>
                                        <p className='text-sm text-muted-foreground flex-1'>
                                            {tip.tip[language]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Main>
        </>
    )
}
