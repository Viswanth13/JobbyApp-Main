import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    username: 'henry',
    password: 'henry_the_developer',
    errorMsg: '',
  }

  updateUsername = event => {
    this.setState({
      username: event.target.value,
    })
  }

  updatePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  onSubmitSuccess = jwtToken => {
    this.setState({
      errorMsg: '',
    })

    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })

    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      errorMsg,
    })
  }

  formSubmitted = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-bg-container">
        <form className="form-container" onSubmit={this.formSubmitted}>
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <label htmlFor="usernameInput">USERNAME</label>
          <input
            type="text"
            id="usernameInput"
            placeholder="Username"
            value={username}
            onChange={this.updateUsername}
            className="input-box"
            autoComplete="off"
          />

          <label htmlFor="passwordInput">PASSWORD</label>
          <input
            type="password"
            id="passwordInput"
            placeholder="Password"
            value={password}
            onChange={this.updatePassword}
            className="input-box"
          />

          <button type="submit" className="login-button">
            Login
          </button>
          <p className="error-msg">{errorMsg}</p>
          <p>Sample credentials are loaded here</p>
        </form>
      </div>
    )
  }
}

export default Login
