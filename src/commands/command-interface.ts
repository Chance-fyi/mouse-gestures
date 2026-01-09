import type { ConfigType } from "~enum/command"

export interface CommandInterface {
  readonly uniqueKey: string
  readonly title: string
  readonly description: string
  config: { [key: string]: Config }
  window?: boolean
  data?: any
  permissions?: string[]
  execute: () => void
}

export type ConfigSelectOption = {
  readonly label: string
  readonly value: string
}

export type Config = {
  readonly title: string
  readonly description: string
  readonly type: ConfigType
  readonly options?: ConfigSelectOption[]
  value: string | number | boolean
}
