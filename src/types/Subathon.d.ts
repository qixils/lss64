export interface Supporter {
  index: number
  user: string
  action: 'sub' | 'gift-sub' | 'bits'
  amount: number
}

export interface SubathonState {
  percentile: number
  goal: string // time string
  supporters: Supporter[]
}
