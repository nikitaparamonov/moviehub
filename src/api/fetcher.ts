import { BASE_URL, API_KEY } from './config'

const DEFAULT_PARAMS = { language: 'en-US', page: 1 }

export async function fetchTMDB<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    if (!API_KEY) throw new Error('TMDB API key is missing')

    const allParams = { api_key: API_KEY, ...DEFAULT_PARAMS, ...params }
    const query = new URLSearchParams(
        Object.entries(allParams).map(([k, v]) => [k, String(v)])
    )
    const url = `${BASE_URL}${endpoint}?${query.toString()}`

    const res = await fetch(url)
    if (!res.ok) {
        const text = await res.text()
        throw new Error(`TMDB API error: ${res.status} ${text}`)
    }

    return res.json() as Promise<T>
}
