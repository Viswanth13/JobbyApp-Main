import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {HiOutlineLogout} from 'react-icons/hi'
import './index.css'

class Header extends Component {
  logoutClicked = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    return (
      <>
        <div className="navbar-container">
          <Link to="/">
            <img
              className="header-website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
          <div className="nav-symbols-container">
            <Link to="/" className="link-decoration">
              <p>Home</p>
            </Link>
            <Link to="/jobs" className="link-decoration">
              <p>Jobs</p>
            </Link>

            <button
              type="button"
              className="logout-button"
              onClick={this.logoutClicked}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mobile-nav-bar">
          <Link to="/">
            <img
              className="header-website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul type="none" className="nav-symbols-container">
            <li>
              <Link to="/" className="link-decoration">
                <AiFillHome className="nav-symbols" />
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="link-decoration">
                <BsFillBriefcaseFill className="nav-symbols" />
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="logout-icon"
                onClick={this.logoutClicked}
              >
                <HiOutlineLogout />
              </button>
            </li>
          </ul>
        </div>
      </>
    )
  }
}
export default withRouter(Header)
