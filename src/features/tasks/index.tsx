import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  UploadCloud,
  Bot,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'

// Shadcn UI Components
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DatePicker } from '@/components/date-picker' // 기존 프로젝트에 있는 컴포넌트 활용
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'

// --- Mock Data & Types ---

const MOCK_AI_RECOMMENDATIONS = {
  recommendations: [
    { id: '1', title: '비계 설치 작업', confidence: 0.95 },
    { id: '2', title: '고소 작업', confidence: 0.8 },
    { id: '3', title: '자재 인양 작업', confidence: 0.6 },
  ],
}

const MOCK_AI_RISKS = [
  { potentialRisk: '추락 위험', measure: '안전대 착용 및 생명줄 체결 철저' },
  { potentialRisk: '낙하물에 의한 타격', measure: '상부 작업 구간 통제 및 낙하물 방지망 설치' },
  { potentialRisk: '자재 붕괴', measure: '적재 하중 준수 및 결속 상태 확인' },
]

// --- Schema Definition ---

const tbmFormSchema = z.object({
  // 0. AI & Image
  imageUrl: z.string().optional(),

  // 1. Basic Info
  taskName: z.string().min(1, '작업명을 입력해주세요.'),
  taskDescription: z.string().optional(),
  location: z.string().min(1, 'TBM 장소를 입력해주세요.'),
  tbmDate: z.date(),
  tbmTime: z.string().min(1, '시간을 선택해주세요.'),
  workDate: z.date(),
  isSameDate: z.boolean().default(true),
  hasRiskAssessment: z.boolean().default(true),

  // 2. Risk Factors (Dynamic)
  riskFactors: z
    .array(
      z.object({
        potentialRisk: z.string().min(1, '위험요인을 입력하세요.'),
        measure: z.string().min(1, '대책을 입력하세요.'),
      })
    )
    .min(1, '최소 1개의 위험요인을 작성해야 합니다.')
    .max(3, '최대 3개까지 입력 가능합니다.'),

  keyRiskIndex: z.string().min(1, '중점 위험요인을 하나 선정해주세요.'), // RadioGroup value is string

  // 3. Safety Checks
  check1: z.enum(['yes', 'no']),
  check1Action: z.string().optional(),
  check2: z.enum(['yes', 'no']),
  check2Action: z.string().optional(),
  check3: z.enum(['yes', 'no']),
  check3Action: z.string().optional(),

  // Closing
  unresolvedRisksChecked: z.boolean().default(false),
  workerAwarenessChecked: z.boolean().default(false),
  closingComment: z.string().optional(),
})

type TbmFormValues = z.infer<typeof tbmFormSchema>

// --- Main Component ---

export function Tasks() {
  // --- Form Hooks ---
  const form = useForm<TbmFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(tbmFormSchema) as any,
    defaultValues: {
      taskName: '',
      taskDescription: '',
      location: '',
      tbmDate: new Date(),
      tbmTime: '08:00',
      workDate: new Date(),
      isSameDate: true,
      hasRiskAssessment: true,
      riskFactors: [{ potentialRisk: '', measure: '' }], // Start with 1 empty slot
      keyRiskIndex: '0', // Default 1st item selected
      check1: 'yes',
      check2: 'yes',
      check3: 'yes',
      unresolvedRisksChecked: false,
      workerAwarenessChecked: false,
      closingComment: '',
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formControl = form.control as any

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'riskFactors',
  })

  // --- States ---
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<typeof MOCK_AI_RECOMMENDATIONS.recommendations>([])
  const [isGeneratingRisks, setIsGeneratingRisks] = useState(false)

  // --- Handlers ---

  // 0. Image Upload & AI Analysis
  const handleImageDrop = async (e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
    let file: File | undefined

    if ('dataTransfer' in e) {
      e.preventDefault()
      file = e.dataTransfer.files[0]
    } else {
      file = e.target.files?.[0]
    }

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Simulate AI Analysis
      setIsUploading(true)
      toast.info('AI가 이미지를 분석하고 있습니다...', { duration: 1500 })

      // Mock Backend Call
      setTimeout(() => {
        setAiRecommendations(MOCK_AI_RECOMMENDATIONS.recommendations)
        setIsUploading(false)
        // Auto-select the first one (highest confidence)
        if (MOCK_AI_RECOMMENDATIONS.recommendations.length > 0) {
          form.setValue('taskName', MOCK_AI_RECOMMENDATIONS.recommendations[0].title)
        }
        toast.success('분석 완료! 작업명을 추천해드렸습니다.')
      }, 1500)
    }
  }

  // 1. AI Auto-fill Basic Info
  const handleAutoFillBasic = () => {
    form.setValue('taskDescription', '금일 작업은 고소 구간에서 비계 설치 및 자재 인양을 진행함에 있어 추락 및 낙하 사고 예방을 최우선으로 함.')
    form.setValue('location', 'A동 3층 외벽 구간')
    toast.success('작업 개요가 자동 완성되었습니다.')
  }

  // 2. AI Generate Risks
  const handleGenerateRisks = () => {
    setIsGeneratingRisks(true)
    // Mock Backend Call
    setTimeout(() => {
      // Replace current fields with mock data
      form.setValue('riskFactors', MOCK_AI_RISKS)
      setIsGeneratingRisks(false)
      toast.success('AI가 위험요인과 대책을 도출했습니다.')
    }, 1000)
  }

  // 3. Date Sync Logic
  const tbmDate = form.watch('tbmDate')
  const isSameDate = form.watch('isSameDate')
  const currentTaskName = form.watch('taskName')
  const keyRiskIndex = form.watch('keyRiskIndex')
  const riskFactors = form.watch('riskFactors')
  const check1 = form.watch('check1')
  const check2 = form.watch('check2')
  const check3 = form.watch('check3')

  useEffect(() => {
    if (isSameDate && tbmDate) {
      form.setValue('workDate', tbmDate)
    }
  }, [tbmDate, isSameDate, form])

  // Form Submit
  const onSubmit = (data: TbmFormValues) => {
    // eslint-disable-next-line no-console
    console.log('TBM Submitted:', data)
    toast.success('TBM 작성이 완료되었습니다!')
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>TBM 작성</h2>
            <p className='text-muted-foreground'>
              오늘의 안전한 작업을 위해 TBM(Tool Box Meeting) 내용을 작성해주세요.
            </p>
          </div>
          <Button type='submit' form='tbm-form' size='lg'>
            작성 완료
          </Button>
        </div>

        <Form {...form}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <form id='tbm-form' onSubmit={form.handleSubmit(onSubmit as any)} className='space-y-6'>

            {/* 0. AI 이미지 분석 섹션 */}
            <Card className='border-dashed border-2 shadow-sm'>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="size-5 text-purple-500" />
                  AI 이미지 분석 템플릿
                </CardTitle>
                <CardDescription>
                  현장 사진을 업로드하면 AI가 자동으로 작업명을 추천하고 위험성평가 기초 자료를 생성합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Dropzone */}
                  <div
                    className="relative flex h-64 w-full md:w-1/2 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 transition-colors hover:bg-muted"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleImageDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={handleImageDrop}
                    />
                    {imagePreview ? (
                      <div className="relative size-full overflow-hidden rounded-lg">
                        <img src={imagePreview} alt="Preview" className="size-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white font-medium">사진 변경하기</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <UploadCloud className="size-10" />
                        <p className="font-medium">사진을 드래그하거나 클릭하여 업로드</p>
                        <p className="text-xs">JPG, PNG (최대 10MB)</p>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                        <Loader2 className="size-10 animate-spin text-primary" />
                        <p className="mt-2 font-medium text-primary">AI 분석중...</p>
                      </div>
                    )}
                  </div>

                  {/* AI Results */}
                  <div className="flex w-full md:w-1/2 flex-col gap-4">
                    <div className="space-y-2">
                      <FormLabel>추천 작업명 (AI 분석 결과)</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {aiRecommendations.length > 0 ? (
                          aiRecommendations.map((rec) => (
                            <Badge
                              key={rec.id}
                              variant={currentTaskName === rec.title ? 'default' : 'outline'}
                              className="cursor-pointer px-3 py-1 text-sm hover:bg-primary/90 hover:text-primary-foreground"
                              onClick={() => form.setValue('taskName', rec.title)}
                            >
                              {rec.title} ({Math.round(rec.confidence * 100)}%)
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">사진을 업로드하면 추천 작업명이 표시됩니다.</p>
                        )}
                      </div>
                    </div>

                    <FormField
                      control={formControl}
                      name="hasRiskAssessment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">위험성평가 연동</FormLabel>
                            <FormDescription>
                              선택한 작업명을 기반으로 위험성평가를 자동으로 불러옵니다.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 1. 기본 정보 섹션 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>기본 정보</CardTitle>
                  <CardDescription>작업의 개요를 입력합니다.</CardDescription>
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={handleAutoFillBasic} className="gap-2">
                  <Bot className="size-4" /> AI 자동 입력
                </Button>
              </CardHeader>
              <Separator />
              <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
                <FormField
                  control={formControl}
                  name="tbmDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>TBM 일시</FormLabel>
                      <div className="flex gap-2">
                        <DatePicker
                          selected={field.value}
                          onSelect={field.onChange}
                          placeholder="날짜 선택"
                        />
                        <Input
                          type="time"
                          className="w-[120px]"
                          {...form.register('tbmTime')}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formControl}
                  name="workDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <FormLabel>작업 날짜</FormLabel>
                        <FormField
                          control={formControl}
                          name="isSameDate"
                          render={({ field: checkboxField }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="sameDate"
                                checked={checkboxField.value}
                                onCheckedChange={checkboxField.onChange}
                              />
                              <label htmlFor="sameDate" className="text-xs font-medium leading-none cursor-pointer">
                                TBM 날짜와 동일
                              </label>
                            </div>
                          )}
                        />
                      </div>
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                        // disabled={form.watch('isSameDate')}
                        placeholder="작업 날짜 선택"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formControl}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>작업명</FormLabel>
                      <FormControl>
                        <Input placeholder="예: 3층 배관 용접 작업" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formControl}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TBM 장소</FormLabel>
                      <FormControl>
                        <Input placeholder="예: 현장 안전교육장" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formControl}
                  name="taskDescription"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>작업 내용</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="구체적인 작업 내용을 입력하세요."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 2. 위험요인 및 대책 수립 (핵심) */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <AlertTriangle className="size-5" /> 위험요인 및 대책
                    </CardTitle>
                    <CardDescription>잠재 위험요인을 도출하고 중점 관리 항목을 선정하세요.</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateRisks}
                    disabled={isGeneratingRisks}
                    className="gap-2 border-primary/50 text-primary hover:bg-primary/5"
                  >
                    {isGeneratingRisks ? <Loader2 className="size-4 animate-spin" /> : <Bot className="size-4" />}
                    AI 위험성평가 도출
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={formControl}
                  name="keyRiskIndex"
                  render={({ field: radioField }) => (
                    <RadioGroup
                      onValueChange={radioField.onChange}
                      defaultValue={radioField.value}
                      className="space-y-4"
                    >
                      {fields.map((field, index) => (
                        <div key={field.id} className="relative grid gap-4 rounded-xl border p-4 shadow-sm transition-all hover:border-primary/50 md:grid-cols-[auto_1fr_1fr_auto]">

                          {/* 중점 선정 라디오 버튼 */}
                          <div className="flex flex-col items-center justify-center gap-2 border-r pr-4">
                            <FormLabel className="text-xs text-muted-foreground text-center w-max">중점<br />선정</FormLabel>
                            <FormControl>
                              <RadioGroupItem value={index.toString()} />
                            </FormControl>
                          </div>

                          <FormField
                            control={formControl}
                            name={`riskFactors.${index}.potentialRisk`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={index === 0 ? "" : "sr-only"}>잠재위험요인</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder={`위험요인 ${index + 1}`} className="bg-background" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={formControl}
                            name={`riskFactors.${index}.measure`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={index === 0 ? "" : "sr-only"}>안전 대책</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder={`대책 ${index + 1}`} className="bg-background" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex items-end pb-1">
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            )}
                          </div>

                          {/* 중점 선정 시 강조 효과 (Visual Feedback) */}
                          {radioField.value === index.toString() && (
                            <div className="absolute inset-0 -z-10 rounded-xl bg-primary/5 ring-1 ring-primary pointer-events-none" />
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />

                {fields.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full border-dashed"
                    onClick={() => append({ potentialRisk: '', measure: '' })}
                  >
                    <Plus className="mr-2 size-4" /> 항목 추가하기 ({fields.length}/3)
                  </Button>
                )}

                {/* 중점 위험요인 요약 (선택 시 자동 표시) */}
                <div className="mt-6 rounded-lg bg-slate-950 p-4 text-slate-50">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-400">
                    <CheckCircle2 className="size-4" /> 금일 중점 위험요인
                  </h4>
                  <p className="mt-2 text-lg font-bold">
                    {riskFactors[parseInt(keyRiskIndex)]?.potentialRisk || '(위험요인을 입력하고 왼쪽 라디오 버튼을 선택하세요)'}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    ↳ 대책: {riskFactors[parseInt(keyRiskIndex)]?.measure || '-'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 3. 안전 점검 및 조치 확인 */}
            <Card>
              <CardHeader>
                <CardTitle>작업 전 안전조치 확인</CardTitle>
                <CardDescription>현장 안전 상태를 점검하고 미흡 사항 조치를 입력하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {[1, 2, 3].map((num) => {
                  const checkKey = `check${num}` as keyof TbmFormValues
                  const actionKey = `check${num}Action` as keyof TbmFormValues
                  const isCheckedNo = num === 1 ? check1 === 'no' : num === 2 ? check2 === 'no' : check3 === 'no'

                  return (
                    <div key={num} className="space-y-3 rounded-lg border p-4">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <span className="font-medium text-sm sm:text-base">
                          {num}. {num === 1 ? '개인보호구 착용 상태는 양호한가?' : num === 2 ? '작업장 주변 정리정돈은 되어있는가?' : '사용 공구 및 장비의 점검은 완료되었는가?'}
                        </span>
                        <FormField
                          control={formControl}
                          name={checkKey}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value as string}
                                  className="flex gap-2"
                                >
                                  <FormItem className="flex items-center space-x-1 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="yes" id={`c${num}-yes`} />
                                    </FormControl>
                                    <FormLabel htmlFor={`c${num}-yes`} className="font-normal cursor-pointer">
                                      예
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-1 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="no" id={`c${num}-no`} className="data-[state=checked]:border-destructive data-[state=checked]:text-destructive" />
                                    </FormControl>
                                    <FormLabel htmlFor={`c${num}-no`} className="font-normal cursor-pointer text-destructive">
                                      아니오
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* 조건부 렌더링: '아니오' 선택 시 조치 입력창 표시 */}
                      {isCheckedNo && (
                        <FormField
                          control={formControl}
                          name={actionKey}
                          render={({ field }) => (
                            <FormItem className="animate-in slide-in-from-top-2 fade-in">
                              <FormLabel className="text-destructive text-xs">조치 내용 (필수)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="미흡 사항에 대한 조치 내용을 입력하세요." className="border-destructive/50 focus-visible:ring-destructive" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )
                })}

              </CardContent>
            </Card>

            {/* 4. 일일 안전점검 및 종료 */}
            <Card>
              <CardHeader>
                <CardTitle>종료 미팅 및 확인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <FormField
                    control={formControl}
                    name="unresolvedRisksChecked"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 flex-1">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>위험요인 미조치 사항 확인</FormLabel>
                          <FormDescription>
                            미조치된 위험요인이 없음을 확인합니다.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formControl}
                    name="workerAwarenessChecked"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 flex-1">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>작업자 숙지 여부 확인</FormLabel>
                          <FormDescription>
                            모든 작업자가 TBM 내용을 숙지했음을 확인합니다.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={formControl}
                  name="closingComment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>작업 후 종료 미팅 (실효성 확인)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="금일 작업 중 특이사항이나 개선점이 있었다면 기록해주세요."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

          </form>
        </Form>
      </Main>
    </>
  )
}