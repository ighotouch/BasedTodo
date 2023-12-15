export default {
  languages: ['en'],
  types: {
    file: {
      prefix: 'fi',
    },
    user: {
      prefix: 'us',
    },
    todo: {
      prefix: 'to',
      fields: {
        title: { type: 'text' },
        completed: { type: 'boolean' },
      },
    },
  },
}
