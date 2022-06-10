import { atom, WritableAtom } from 'jotai'

export type FetchInput =
  | RequestInfo
  | {
      info: RequestInfo
      init?: RequestInit
    }

export interface FetchResult<T> {
    fetching?: boolean
    data?: T
    error?: unknown
  }

interface FetchBehavior<T> {
    getResponseData?: (response: Response) => Promise<T | undefined>
  }

  const defaultGetResponseData = async <T>(response: Response): Promise<T | undefined> => {
    if (response.ok) {
      return await (response.json() as Promise<T>)
    }
  }

export const fetchJsonAtom = <T>(
    behavior?: FetchBehavior<T>,
  ): WritableAtom<FetchResult<T>, FetchInput | null, Promise<void>> => {
    const resultAtom = atom<FetchResult<T>>({ fetching: false })
    const getResponseData = behavior?.getResponseData ?? defaultGetResponseData
  
    const runFetchAtom = atom(
      (get) => get(resultAtom),
      async (get, set, input: FetchInput | null) => {
        set(resultAtom, {
          fetching: input != null,
          data: undefined,
        })
  
        if (input == null) {
          return
        }
  
        let response
        try {
          if (typeof input === 'string' || input instanceof Request) {
            response = await fetch(input)
          } else {
            response = await fetch(input.info, input.init)
          }
  
          const data = await getResponseData(response)
          set(resultAtom, { fetching: false, data })
        } catch (error) {
          set(resultAtom, { fetching: false, error })
        }
  
        return get(resultAtom)
      },
    )
  
    return runFetchAtom
  }
  