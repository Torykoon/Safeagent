// ----------------------------------------------------------------------
// Worker 대시보드 데이터 및 다국어 지원
// ----------------------------------------------------------------------

export type Language = 'ko' | 'en' | 'zh' | 'vi'

export interface LanguageOption {
    code: Language
    name: string
    flag: string
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
]

// ----------------------------------------------------------------------
// 다국어 번역 데이터
// ----------------------------------------------------------------------

export const translations: Record<Language, {
    greeting: string
    dashboard: string
    weather: string
    temperature: string
    humidity: string
    windSpeed: string
    currentTime: string
    criticalRisk: string
    criticalRiskDesc: string
    todayTasks: string
    todayTasksDesc: string
    selectLanguage: string
    urgentNotice: string
    safetyTip: string
    safetyTipTitle: string
    workSafely: string
    highRisk: string
    mediumRisk: string
    lowRisk: string
}> = {
    ko: {
        greeting: '안녕하세요',
        dashboard: '작업자 대시보드',
        weather: '현재 날씨',
        temperature: '온도',
        humidity: '습도',
        windSpeed: '풍속',
        currentTime: '현재 시간',
        criticalRisk: '오늘의 치명적 위험요인',
        criticalRiskDesc: '오늘 작업 중 가장 주의해야 할 위험요인입니다.',
        todayTasks: '오늘 수행할 작업',
        todayTasksDesc: '오늘 예정된 작업 목록입니다.',
        selectLanguage: '언어 선택',
        urgentNotice: '긴급 공지사항',
        safetyTip: '오늘의 안전 수칙',
        safetyTipTitle: '안전 수칙 알림',
        workSafely: '안전 작업',
        highRisk: '고위험',
        mediumRisk: '중위험',
        lowRisk: '저위험',
    },
    en: {
        greeting: 'Hello',
        dashboard: 'Worker Dashboard',
        weather: 'Current Weather',
        temperature: 'Temperature',
        humidity: 'Humidity',
        windSpeed: 'Wind Speed',
        currentTime: 'Current Time',
        criticalRisk: 'Critical Risk Factors Today',
        criticalRiskDesc: 'The most important risk factors to be aware of today.',
        todayTasks: 'Today\'s Tasks',
        todayTasksDesc: 'List of scheduled tasks for today.',
        selectLanguage: 'Select Language',
        urgentNotice: 'Urgent Notice',
        safetyTip: 'Today\'s Safety Tip',
        safetyTipTitle: 'Safety Reminder',
        workSafely: 'Work Safely',
        highRisk: 'High Risk',
        mediumRisk: 'Medium Risk',
        lowRisk: 'Low Risk',
    },
    zh: {
        greeting: '您好',
        dashboard: '工人仪表板',
        weather: '当前天气',
        temperature: '温度',
        humidity: '湿度',
        windSpeed: '风速',
        currentTime: '当前时间',
        criticalRisk: '今日重大风险因素',
        criticalRiskDesc: '今天工作中最需要注意的风险因素。',
        todayTasks: '今日工作任务',
        todayTasksDesc: '今天计划的工作任务列表。',
        selectLanguage: '选择语言',
        urgentNotice: '紧急通知',
        safetyTip: '今日安全提示',
        safetyTipTitle: '安全提醒',
        workSafely: '安全作业',
        highRisk: '高风险',
        mediumRisk: '中风险',
        lowRisk: '低风险',
    },
    vi: {
        greeting: 'Xin chào',
        dashboard: 'Bảng điều khiển công nhân',
        weather: 'Thời tiết hiện tại',
        temperature: 'Nhiệt độ',
        humidity: 'Độ ẩm',
        windSpeed: 'Tốc độ gió',
        currentTime: 'Thời gian hiện tại',
        criticalRisk: 'Yếu tố rủi ro nghiêm trọng hôm nay',
        criticalRiskDesc: 'Các yếu tố rủi ro quan trọng nhất cần lưu ý hôm nay.',
        todayTasks: 'Công việc hôm nay',
        todayTasksDesc: 'Danh sách công việc dự kiến cho hôm nay.',
        selectLanguage: 'Chọn ngôn ngữ',
        urgentNotice: 'Thông báo khẩn cấp',
        safetyTip: 'Mẹo an toàn hôm nay',
        safetyTipTitle: 'Nhắc nhở an toàn',
        workSafely: 'Làm việc an toàn',
        highRisk: 'Rủi ro cao',
        mediumRisk: 'Rủi ro trung bình',
        lowRisk: 'Rủi ro thấp',
    },
}

// ----------------------------------------------------------------------
// Mock 데이터
// ----------------------------------------------------------------------

export interface WeatherData {
    temperature: number
    humidity: number
    windSpeed: number
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
    alert?: string
}

export interface RiskFactor {
    id: string
    title: Record<Language, string>
    description: Record<Language, string>
    level: 'high' | 'medium' | 'low'
    icon: string
}

export interface TaskItem {
    id: string
    title: Record<Language, string>
    location: string
    time: string
}

export interface Notice {
    id: string
    title: Record<Language, string>
    content: Record<Language, string>
    type: 'urgent' | 'normal'
}

export interface SafetyTip {
    id: string
    tip: Record<Language, string>
}

// Mock 날씨 데이터
export const mockWeather: WeatherData = {
    temperature: 5,
    humidity: 65,
    windSpeed: 8,
    condition: 'cloudy',
    alert: undefined,
}

// Mock 위험요인 데이터
export const mockRiskFactors: RiskFactor[] = [
    {
        id: 'risk-1',
        title: {
            ko: '고소 작업 추락 위험',
            en: 'Fall Risk from Height Work',
            zh: '高空作业坠落风险',
            vi: 'Nguy cơ ngã từ độ cao',
        },
        description: {
            ko: 'A구역 10m 이상 고소작업 진행 예정. 안전대 착용 필수.',
            en: 'Work above 10m scheduled in Zone A. Safety harness required.',
            zh: 'A区计划进行10米以上高空作业。必须佩戴安全带。',
            vi: 'Công việc trên 10m dự kiến tại Khu A. Cần đeo dây an toàn.',
        },
        level: 'high',
        icon: '🏗️',
    },
    {
        id: 'risk-2',
        title: {
            ko: '용접 작업 화재 위험',
            en: 'Fire Risk from Welding',
            zh: '焊接作业火灾风险',
            vi: 'Nguy cơ cháy từ hàn',
        },
        description: {
            ko: 'B구역 용접작업 시 소화기 비치 및 화기감시자 배치 필요.',
            en: 'Fire extinguisher and fire watch required in Zone B.',
            zh: 'B区焊接作业需配备灭火器和火灾监视员。',
            vi: 'Cần bình chữa cháy và người giám sát tại Khu B.',
        },
        level: 'high',
        icon: '🔥',
    },
]

// Mock 작업 목록
export const mockTasks: TaskItem[] = [
    {
        id: 'task-1',
        title: {
            ko: '안전 조회 참석',
            en: 'Safety Briefing Attendance',
            zh: '安全会议出席',
            vi: 'Tham dự họp an toàn',
        },
        location: 'A구역',
        time: '08:00',
    },
    {
        id: 'task-2',
        title: {
            ko: '철골 설치 작업',
            en: 'Steel Frame Installation',
            zh: '钢结构安装作业',
            vi: 'Lắp đặt khung thép',
        },
        location: 'B구역 3층',
        time: '09:00 - 12:00',
    },
    {
        id: 'task-3',
        title: {
            ko: '점심 휴식',
            en: 'Lunch Break',
            zh: '午休',
            vi: 'Nghỉ trưa',
        },
        location: '휴게실',
        time: '12:00 - 13:00',
    },
    {
        id: 'task-4',
        title: {
            ko: '마감 작업 및 정리',
            en: 'Finishing Work & Cleanup',
            zh: '收尾作业及清理',
            vi: 'Hoàn thiện và dọn dẹp',
        },
        location: 'B구역',
        time: '13:00 - 17:00',
    },
]

// Mock 공지사항
export const mockNotice: Notice = {
    id: 'notice-1',
    title: {
        ko: '내일 오전 안전점검 실시',
        en: 'Safety Inspection Tomorrow Morning',
        zh: '明天上午进行安全检查',
        vi: 'Kiểm tra an toàn sáng mai',
    },
    content: {
        ko: '12월 23일(월) 오전 9시 전체 현장 안전점검이 실시됩니다. 모든 근로자는 개인보호구 착용 상태를 점검해주세요.',
        en: 'A site-wide safety inspection will be conducted on Dec 23 (Mon) at 9 AM. All workers please check your PPE.',
        zh: '12月23日（周一）上午9点将进行全场安全检查。所有工人请检查个人防护装备。',
        vi: 'Kiểm tra an toàn toàn công trường sẽ được tiến hành vào 9h sáng ngày 23/12 (Thứ 2). Tất cả công nhân vui lòng kiểm tra PPE.',
    },
    type: 'urgent',
}

// Mock 안전 수칙
export const mockSafetyTips: SafetyTip[] = [
    {
        id: 'tip-1',
        tip: {
            ko: '작업 전 반드시 안전모, 안전화, 안전조끼를 착용하세요.',
            en: 'Always wear safety helmet, safety shoes, and safety vest before work.',
            zh: '作业前请务必佩戴安全帽、安全鞋和安全背心。',
            vi: 'Luôn đội mũ bảo hộ, giày an toàn và áo phản quang trước khi làm việc.',
        },
    },
    {
        id: 'tip-2',
        tip: {
            ko: '고소작업 시 안전대 체결 상태를 반드시 확인하세요.',
            en: 'Always check your safety harness connection when working at height.',
            zh: '高空作业时请务必检查安全带连接状态。',
            vi: 'Luôn kiểm tra dây an toàn khi làm việc trên cao.',
        },
    },
]
