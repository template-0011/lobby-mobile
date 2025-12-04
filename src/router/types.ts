import type { RouteLocationNormalized } from 'vue-router'

export type EnhancedRouteLocation = {
  meta: {
    level?: number | unknown
    name?: string
    keepAlive?: boolean
  }
} & RouteLocationNormalized
