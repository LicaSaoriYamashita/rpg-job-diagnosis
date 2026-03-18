import { createClient } from '@supabase/supabase-js'

export function useSupabase() {
  const config = useRuntimeConfig()

  const url = config.public.supabaseUrl as string
  const key = config.public.supabaseKey as string

  if (!url || !key) {
    console.warn('[useSupabase] Supabase env vars not set. NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_KEY are required.')
    const noop = async () => null
    return { saveResult: noop as any, getResult: noop as any }
  }

  const supabase = createClient(url, key)

  async function saveResult(data: {
    main_job: string
    sub_jobs: string[]
    answers: Record<string, string>
  }): Promise<string | null> {
    console.log('[useSupabase] Saving result...', data.main_job)
    const { data: result, error } = await supabase
      .from('results')
      .insert(data)
      .select('id')
      .single()
    if (error) {
      console.error('[useSupabase] Failed to save result:', error.message, error.details)
      return null
    }
    console.log('[useSupabase] Saved with id:', result.id)
    return result.id
  }

  async function getResult(id: string) {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      console.error('[useSupabase] Failed to get result:', error.message)
      return null
    }
    return data
  }

  return { saveResult, getResult }
}
