import { useSignMessage } from "wagmi"

export function SignMessage() {
    const { data, signMessage } = useSignMessage()
  
    return (
      <div>
        <h2>Sign Message</h2>
  
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.target as HTMLFormElement)
            signMessage({ message: formData.get('message') as string })
          }}
        >
          <input name="message" />
          <button type="submit">Sign Message</button>
        </form>
  
        {data}
      </div>
    )
  }