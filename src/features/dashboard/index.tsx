import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import {
  AlertTriangle,
  CheckCircle2,
  CloudRain,
  Construction,
  Droplets,
  HardHat,
  Megaphone,
  ShieldCheck,
  Thermometer,
  Wind,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

// --- Mock Data (가상 데이터) ---
const dashboardData = {
  weather: {
    temp: 28,
    humidity: 75,
    windSpeed: 12, // m/s
    rain: 0,
    dust: 45, // µg/m³
    status: 'Good', // Normal, Caution, Warning
    alertMessage: '풍속 10m/s 이상, 타워크레인 작업 주의',
  },
  safetyIndex: {
    dDay: 365,
    grade: 'A',
    score: 95,
  },
  ptw: {
    total: 15,
    approved: 10,
    pending: 3,
    rejected: 2,
    highRiskCounts: {
      fire: 5,
      confined: 3,
      height: 7,
    },
  },
  workers: {
    total: 124,
    composition: [
      { name: '일반 근로자', value: 84, color: '#10b981' }, // emerald-500
      { name: '신규 채용자', value: 15, color: '#3b82f6' }, // blue-500
      { name: '외국인 근로자', value: 20, color: '#f59e0b' }, // amber-500
      { name: '건강 유소견자', value: 5, color: '#ef4444' }, // red-500
    ],
  },
  tbm: [
    {
      id: 1,
      team: '토목 A팀',
      leader: '김반장',
      photoUploaded: true,
      signRate: 100,
      status: 'completed',
    },
    {
      id: 2,
      team: '건축 B팀',
      leader: '이반장',
      photoUploaded: true,
      signRate: 90,
      status: 'completed',
    },
    {
      id: 3,
      team: '전기 C팀',
      leader: '박반장',
      photoUploaded: false,
      signRate: 0,
      status: 'incomplete',
    },
    {
      id: 4,
      team: '설비 D팀',
      leader: '최반장',
      photoUploaded: true,
      signRate: 85,
      status: 'completed',
    },
    {
      id: 5,
      team: '안전팀',
      leader: '정반장',
      photoUploaded: false,
      signRate: 40,
      status: 'incomplete',
    },
  ],
}

export function Dashboard() {
  const { weather, safetyIndex, ptw, workers, tbm } = dashboardData

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='flex items-center gap-2'>
          <ShieldCheck className='text-primary size-6' />
          <h1 className='text-lg font-bold tracking-tight md:text-xl'>
            현장 안전 대시보드
          </h1>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main Content ===== */}
      <Main>
        <div className='flex flex-col gap-4'>
          {/* Row 1: Weather & Safety Index */}
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {/* A. 기상 정보 & 경보 */}
            <Card className='lg:col-span-2'>
              <CardHeader className='pb-2'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <CloudRain className='size-5' /> 실시간 기상 정보 및 경보
                  </CardTitle>
                  {weather.windSpeed >= 10 && (
                    <Badge variant='destructive' className='animate-pulse'>
                      <Megaphone className='mr-1 size-3' /> 작업 중지 권고
                    </Badge>
                  )}
                </div>
                <CardDescription>{weather.alertMessage}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                  <div className='bg-muted/50 flex flex-col items-center justify-center rounded-lg p-3 text-center'>
                    <span className='text-muted-foreground flex items-center gap-1 text-xs'>
                      <Wind className='size-3' /> 풍속
                    </span>
                    <span
                      className={`text-xl font-bold ${weather.windSpeed >= 10 ? 'text-destructive' : ''}`}
                    >
                      {weather.windSpeed} m/s
                    </span>
                  </div>
                  <div className='bg-muted/50 flex flex-col items-center justify-center rounded-lg p-3 text-center'>
                    <span className='text-muted-foreground flex items-center gap-1 text-xs'>
                      <Droplets className='size-3' /> 강수량
                    </span>
                    <span className='text-xl font-bold'>{weather.rain} mm</span>
                  </div>
                  <div className='bg-muted/50 flex flex-col items-center justify-center rounded-lg p-3 text-center'>
                    <span className='text-muted-foreground flex items-center gap-1 text-xs'>
                      <Thermometer className='size-3' /> 온도
                    </span>
                    <span className='text-xl font-bold'>{weather.temp} °C</span>
                  </div>
                  <div className='bg-muted/50 flex flex-col items-center justify-center rounded-lg p-3 text-center'>
                    <span className='text-muted-foreground flex items-center gap-1 text-xs'>
                      <CloudRain className='size-3' /> 습도
                    </span>
                    <span className='text-xl font-bold'>
                      {weather.humidity} %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* E. 무재해 현황판 */}
            <Card className='bg-primary text-primary-foreground'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-base text-white'>
                  <ShieldCheck className='size-5' /> 무재해 현황
                </CardTitle>
                <CardDescription className='text-primary-foreground/80'>
                  우리 현장의 안전 목표
                </CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col items-center justify-center gap-2 pt-0'>
                <div className='text-5xl font-extrabold tracking-tighter'>
                  D + {safetyIndex.dDay}
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm opacity-90'>현재 안전 등급:</span>
                  <Badge
                    variant='secondary'
                    className='px-3 text-base font-bold'
                  >
                    {safetyIndex.grade} 등급
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: High Risk & Workers */}
          <div className='grid gap-4 lg:grid-cols-7'>
            {/* B. 고위험 작업 현황 */}
            <Card className='lg:col-span-4'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Construction className='size-5' /> 금일 고위험 작업(PTW) 현황
                </CardTitle>
                <CardDescription>
                  총 {ptw.total}건의 고위험 작업이 예정되어 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='mb-6 grid grid-cols-3 gap-4'>
                  <div className='flex flex-col items-center rounded-lg border p-4 shadow-sm'>
                    <span className='text-muted-foreground text-sm'>
                      승인 완료
                    </span>
                    <span className='text-2xl font-bold text-green-600'>
                      {ptw.approved}
                    </span>
                  </div>
                  <div className='flex flex-col items-center rounded-lg border p-4 shadow-sm'>
                    <span className='text-muted-foreground text-sm'>
                      승인 대기
                    </span>
                    <span className='text-2xl font-bold text-amber-500'>
                      {ptw.pending}
                    </span>
                  </div>
                  <div className='flex flex-col items-center rounded-lg border p-4 shadow-sm'>
                    <span className='text-muted-foreground text-sm'>반려</span>
                    <span className='text-2xl font-bold text-red-500'>
                      {ptw.rejected}
                    </span>
                  </div>
                </div>
                <div className='space-y-4'>
                  <h4 className='text-sm font-semibold'>주요 위험 공종</h4>
                  <div className='flex flex-wrap gap-2'>
                    <Badge variant='outline' className='px-3 py-1'>
                      🔥 화기 작업 {ptw.highRiskCounts.fire}건
                    </Badge>
                    <Badge variant='outline' className='px-3 py-1'>
                      🕳️ 밀폐 공간 {ptw.highRiskCounts.confined}건
                    </Badge>
                    <Badge variant='outline' className='px-3 py-1'>
                      🏗️ 고소 작업 {ptw.highRiskCounts.height}건
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* C. 근로자 출력 및 건강 현황 (도넛 차트) */}
            <Card className='lg:col-span-3'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <HardHat className='size-5' /> 근로자 출력 현황
                </CardTitle>
                <CardDescription>
                  총 출력 인원: {workers.total}명
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[250px] w-full'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={workers.composition}
                        cx='50%'
                        cy='50%'
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey='value'
                      >
                        {workers.composition.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        verticalAlign='bottom'
                        height={36}
                        iconType='circle'
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 3: TBM Compliance Table */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Megaphone className='size-5' /> 스마트 TBM 이행 현황
              </CardTitle>
              <CardDescription>
                팀별 TBM 실시 사진 및 서명률을 확인합니다. 미이행 팀은 즉시
                조치바랍니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>팀명</TableHead>
                    <TableHead>관리자(팀장)</TableHead>
                    <TableHead>사진 업로드</TableHead>
                    <TableHead>서명률</TableHead>
                    <TableHead className='text-right'>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tbm.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className='font-medium'>{item.team}</TableCell>
                      <TableCell>{item.leader}</TableCell>
                      <TableCell>
                        {item.photoUploaded ? (
                          <Badge
                            variant='outline'
                            className='bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700'
                          >
                            업로드 완료
                          </Badge>
                        ) : (
                          <Badge
                            variant='outline'
                            className='bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700'
                          >
                            미업로드
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <span
                            className={
                              item.signRate < 80
                                ? 'font-bold text-red-500'
                                : ''
                            }
                          >
                            {item.signRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        {item.status === 'completed' ? (
                          <div className='flex items-center justify-end gap-1 text-green-600'>
                            <CheckCircle2 className='size-4' />
                            <span className='text-sm'>이행</span>
                          </div>
                        ) : (
                          <div className='flex items-center justify-end gap-1 font-bold text-red-500'>
                            <AlertTriangle className='size-4' />
                            <span className='text-sm'>미이행</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}