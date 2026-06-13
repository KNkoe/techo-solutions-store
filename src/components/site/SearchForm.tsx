'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const SearchForm = ({
  buttonLabel = 'Search stock',
  placeholder = 'Search title, brand, model or storage',
  targetPath = '/search',
}: {
  buttonLabel?: string
  placeholder?: string
  targetPath?: '/search' | '/shop'
}) => {
  const params = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(params.get('q') || '')

  useEffect(() => {
    setQuery(params.get('q') || '')
  }, [params])

  return (
    <form
      className="search-form"
      onSubmit={(event) => {
        event.preventDefault()
        const next = new URLSearchParams(params.toString())

        if (query) next.set('q', query)
        else next.delete('q')

        const queryString = next.toString()
        router.push(queryString ? `${targetPath}?${queryString}` : targetPath)
      }}
    >
      <div className="search-form__field">
        <Search aria-hidden="true" className="search-form__icon" />
        <Input
          aria-label="Search products"
          className="search-form__input"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          value={query}
        />
      </div>
      <Button size="sm" type="submit">
        {buttonLabel}
      </Button>
    </form>
  )
}
