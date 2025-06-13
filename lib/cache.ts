// 간단한 메모리 캐시 구현
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttlMinutes: number = 5) {
    const ttl = ttlMinutes * 60 * 1000 // 분을 밀리초로 변환
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    const isExpired = Date.now() - item.timestamp > item.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  delete(key: string) {
    this.cache.delete(key)
  }
}

export const dashboardCache = new SimpleCache()

// 캐시된 fetch 함수
export async function cachedFetch(url: string, options?: RequestInit, cacheMinutes: number = 2) {
  const cacheKey = `${url}_${JSON.stringify(options || {})}`
  
  // 캐시에서 먼저 확인
  const cached = dashboardCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // 캐시에 없으면 실제 요청
  try {
    const response = await fetch(url, options)
    const data = await response.json()
    
    // 성공적인 응답만 캐싱
    if (response.ok && data.success) {
      dashboardCache.set(cacheKey, data, cacheMinutes)
    }
    
    return data
  } catch (error) {
    throw error
  }
}