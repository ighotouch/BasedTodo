import { BasedQueryFunction } from '@based/functions'

export type TodoItem = {
  id: string
  title: string
}

const Todo: BasedQueryFunction<
  { limit: number; offset: number },
  TodoItem[]
> = async (based, payload, update) => {
  const unsubscribe = based
    .query('db', {
      todos: {
        id: true,
        title: true,
        createdAt: true,
        completed: true,
        $list: {
          $sort: { $field: 'createdAt', $order: 'desc' },
          $offset: payload?.offset || 0,
          $limit: payload?.limit || 50, // so the browser never crashes
          $find: {
            $traverse: 'descendants',
            $filter: {
              $field: 'type',
              $operator: '=',
              $value: 'todo',
            },
          },
        },
      },
    })
    .subscribe(async ({ todos }) => {
      update(
        todos.map((todo) => {
          return {
            ...todo,
          }
        })
      )
    })

  return unsubscribe
}

export default Todo
