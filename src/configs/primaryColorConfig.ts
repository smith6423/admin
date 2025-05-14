export type PrimaryColorConfig = {
  name?: string
  light?: string
  main: string
  dark?: string
}

// Primary color config object
const primaryColorConfig: PrimaryColorConfig[] = [
  {
    name: 'primary-1',
    light: '#63a4ff', // 더 진한 밝은 파랑
    main: '#1976d2', // 진한 파랑(메인)
    dark: '#004ba0' // 아주 진한 파랑
  }
]

export default primaryColorConfig
