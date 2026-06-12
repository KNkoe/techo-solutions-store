'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const SearchForm = () => {
  const params = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(params.get('q') || '')

  return (
    <form
      className="search-form"
      onSubmit={(event) => {
        event.preventDefault()
        const next = new URLSearchParams(params.toString())

        if (query) next.set('q', query)
        else next.delete('q')

        router.push(`/search?${next.toString()}`)
      }}
    >
      <div className="search-form__field">
        <Search aria-hidden="true" className="search-form__icon" />
        <Input
          aria-label="Search products"
          className="search-form__input"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search title, brand, model or storage"
          value={query}
        />
      </div>
      <Button size="sm" type="submit">
        Search stock
      </Button>
    </form>
  )
}
