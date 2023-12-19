import { BasedQueryFunction } from '@based/functions'

export type UserItem = {
  id: string
  name: string
}

const User: BasedQueryFunction<{ name: string }, UserItem[]> = async (
  based,
  payload,
  update
) => {
  const unsubscribe = based
    .query('db', {
      users: {
        id: true,
        $list: {
          $find: {
            $traverse: 'descendants',
            $filter: [
              {
                $field: 'name',
                $operator: '=',
                $value: payload?.name,
              },
            ],
          },
        },
      },
    })
    .subscribe(({ users }) => {
      update(
        users.map((user) => {
          //
          return {
            ...user,
          }
        })
      )
    })

  return unsubscribe
}

export default User
