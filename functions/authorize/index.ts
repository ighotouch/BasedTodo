import { Authorize } from '@based/functions'

// Authorize functions are run every time
// the client calls a function. They return
// a bollean allowing or blocking the request.
const authorize: Authorize = async (based, ctx, _name, payload) => {
  const authState = ctx.session?.authState
  const unsubscribe = await based // not sure this is the best way. I would implement a session management
    .query('db', {
      // $id: authState?.userId,
      users: {
        id: true,
        $list: {
          $find: {
            $traverse: 'descendants',
            $filter: [
              {
                $field: 'name',
                $operator: '=',
                $value: authState?.userId,
              },
            ],
          },
        },
      },
    })
    .get()
  if (unsubscribe?.users?.[0]) {
    return true
  }
  return false
}

console.log()
export default authorize
