import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const { container } = render(<Note note={note} />)

  screen.debug()

  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

test('clicking the button calls event handler once', async () => {
    const note = {
      content: 'Component testing is done with react-testing-library',
      important: true
    }
    
    const mockHandler = vi.fn()
  
    render(
      <Note note={note} onClick={mockHandler} />
    )
    
    screen.debug()

    const user = userEvent.setup()
    const button = screen.getByText('Make Not Important')
    // const button = container.querySelector('.testbutton')
    await user.click(button)
    
  
    expect(mockHandler.mock.calls).toHaveLength(1)
  })