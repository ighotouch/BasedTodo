import { Authorize } from '@based/functions'

// Authorize functions are run every time
// the client calls a function. They return
// a bollean allowing or blocking the request.
const authorize: Authorize = async (based, ctx) => {
  const authState = ctx.session?.authState
  const user = await based // not sure this is the best way. I would implement a session management
    .query('db', {
      $id: authState?.userId,
      name: true,
    })
    .get()
  if (user?.name) {
    return true
  }
  return false
}
export default authorize
