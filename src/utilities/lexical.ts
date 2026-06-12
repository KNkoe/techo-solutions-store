import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const simpleLexical = (
  heading: string,
  paragraphs: string[] = [],
): DefaultTypedEditorState =>
  ({
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'heading',
        tag: 'h2',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: heading,
            version: 1,
          },
        ],
      },
      ...paragraphs.map((paragraph) => ({
        type: 'paragraph' as const,
        direction: 'ltr' as const,
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
        children: [
          {
            type: 'text' as const,
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text: paragraph,
            version: 1,
          },
        ],
      })),
    ],
  },
} as DefaultTypedEditorState)
