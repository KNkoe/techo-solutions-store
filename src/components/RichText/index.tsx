import {
  DefaultNodeTypes,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { relationTo, value } = linkNode.fields.doc || {}

  if (!value || typeof value !== 'object') return '/'

  if (relationTo === 'products') return `/products/${value.slug}`

  return value.slug === 'home' ? '/' : `/${value.slug}`
}

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
})

export default function RichText({
  data,
  className,
}: {
  className?: string
  data: DefaultTypedEditorState
}) {
  return <ConvertRichText className={`content-richtext ${className || ''}`} converters={jsxConverters} data={data} />
}
