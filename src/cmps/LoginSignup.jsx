import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"
import { login } from "../store/actions/user.actions.js"

function getEmptyCredentials() {
  return {
    username: "",
    password: "",
  }
}

export function LoginSignup() {
  const [credentials, setCredentials] = useState(getEmptyCredentials())
  const navigate = useNavigate()

  useEffect(() => {
    const loggedinUser = userService.getLoggedinUser()
    if (loggedinUser) {
      navigate("/login/admin-settings")
    }
  }, [navigate])

  function handleCredentialsChange(ev) {
    const field = ev.target.name
    const value = ev.target.value
    setCredentials((prevCreds) => ({ ...prevCreds, [field]: value }))
  }

  function onSubmit(ev) {
    ev.preventDefault()
    login(credentials)
      .then((user) => {
        showSuccessMsg(`Welcome ${user.fullname}`)
        navigate("/login/admin-settings") // ניווט אחרי התחברות מוצלחת
      })
      .catch(() => {
        showErrorMsg("Invalid username or password")
      })
  }

  const { username, password } = credentials

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="username"
          value={username}
          placeholder="Username"
          onChange={handleCredentialsChange}
          required
          autoFocus
        />

        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={handleCredentialsChange}
          required
        />

        <button>Login</button>
      </form>
    </div>
  )
}