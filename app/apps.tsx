import React, { useState, useCallback } from 'react'
import { render } from 'react-dom'
import based from '@based/client'
import { Provider, useWindow } from '@based/react'
import basedConfig from '../based.json'
import { VirtualList } from './components/VirtualList/virtualList'
import TodoItem from './components/TodoItem/todoItem'
import InputButton from './components/AddTodo/addTodo'

// NOTE FROM LAST CALL
// List all todos (Done)
// categorise todos based on completed and not completed (Decided to keep the order but add mark as done indicator)
// Add new todos (Done)
// list a million todos (Used a virtual list)
// NICE TO HAVE: implement the authorize function

// My consideration
// I paid a little attention to error handling or UI recovery from an error
// i paid less attention to building components

// Out of scope
// Wrote a little test (Not sure how you expected testing to be done as we did not discuss this
// but i used JEST) i only did little testing because its out of scope.
// I did not test everything i only test what i need to show.

export const client = based(basedConfig)

const App = () => {
  const [limit] = useState(20)

  const [addingTodo, setAddingTodo] = useState(false) // manage the add todo state
  const [loginCode, setLoginCode] = useState<string>()
  const [pages, setPages] = useState([1, 2])

  const { items, loading } = useWindow(
    'todo',
    ({ offset, limit }) => {
      return {
        offset,
        limit,
      }
    },
    {
      path: [], // where are the items in the response?
      pages, // array of page numbers - starts at 1
      size: limit, // amount of items per page
      persistent: true,
    }
  )

  // The authentication logic is currently simplistic.
  // In a production environment, you'd likely want to implement more robust authentication mechanisms,
  // possibly using tokens, securely storing user credentials, and handling login failures more gracefully.
  const handleLogin = async (name: string) => {
    if (name) {
      // => set token on
      // in real world should include proper auth like password
      const result = await client.query('user', { name }).get()
      const user = result[0]
      if (user?.id) {
        setLoginCode(name)
        await client.setAuthState({ userId: 'igho' }) // this should be some GWT TOKEN
      }
    } else {
      alert('Invalid login code. Please try again.')
    }
  }

  const handleLogout = async () => {
    setLoginCode('')
    client.clearAuthState()
  }

  // This generates a unique ID. I wont use this for Production APP.
  const generateUniqueId = () => {
    const uniqueId = `${Date.now().toString(36)}${Math.random()
      .toString(36)
      .substr(2, 6)}`
    return uniqueId.slice(0, 8)
  }

  const handleScroll = useCallback(
    async (_, stopIndex) => {
      const newPage = Math.ceil(stopIndex / limit)

      if (newPage !== pages[pages.length - 1] && newPage !== pages[1]) {
        // Check if the new page is not the last or second page in the current window
        setPages([newPage, newPage + 1])
      }
    },
    [limit, pages]
  )
  const handleClick = async (text) => {
    const myUniqueId = generateUniqueId()
    setAddingTodo(true)
    await client.call('db:set', {
      $id: `to${myUniqueId}`,
      title: { en: text },
    })

    setAddingTodo(false)
  }

  const toggleComplete = async (todo, completed: boolean) => {
    await client.call('db:set', {
      $id: todo.id,
      title: todo.title,
      completed: completed,
    })
  }

  const renderListItem = useCallback(
    // not required to render this all the time thats why its abstracted and memorized
    (todo: any) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggleComplete={() => {
          toggleComplete(todo, !todo.completed)
        }}
      />
    ),
    [toggleComplete]
  )

  return (
    <div
      style={{
        background: '#131313',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: 'white',
      }}
    >
      <img
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '30px',
        }}
        src="https://user-images.githubusercontent.com/683825/203369546-5b50d2f8-71cc-4d13-a7a1-f9a67f2072f6.svg"
      />

      {/* {Authentication switch, i will do this better in prod} */}
      {!loginCode ? (
        <InputButton
          onSubmit={handleLogin}
          placeHolder="Input your login code"
        />
      ) : (
        <>
          {/* {TODO: make this a component} */}
          <div
            style={{ display: 'flex', flexDirection: 'row', marginBottom: 24 }}
          >
            <p>Welcome! please review your tasks.</p>
            <button
              style={{
                padding: '10px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <InputButton onSubmit={handleClick} loading={addingTodo} />
          <VirtualList
            renderItem={renderListItem}
            items={items}
            limit={limit}
            emptyMessage="Nothing todo today feel free to chill on Netflix"
            onScroll={handleScroll}
          />
        </>
      )}

      {loading && <div>Loading...</div>}
    </div>
  )
}

render(
  <Provider client={client}>
    <App />
  </Provider>,
  document.body
)
