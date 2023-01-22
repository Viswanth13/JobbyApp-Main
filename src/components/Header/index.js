import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {GiSuitcase} from 'react-icons/gi'

import './index.css'

class Header extends Component {
  onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  render() {
    return (
      <nav className="nav-header">
        <div className="nav-content">
          <Link to="/">
            <img
              className="website-header-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-menu">
            <Link to="/" className="nav-link">
              <li>Home</li>
            </Link>
            <Link to="/jobs" className="nav-link">
              <li>Jobs</li>
            </Link>

            <button
              type="button"
              className="nav-link,logout-desktop-btn"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
          </ul>
        </div>
        <div className="nav-menu-mobile">
          <ul className="nav-menu-list-mobile">
            <Link to="/">
              <li className="nav-menu-item-mobile">
                <AiFillHome className="home-icon" />
              </li>
            </Link>
            <Link to="/jobs">
              <li className="nav-menu-item-mobile">
                <GiSuitcase className="jobs-icon" />
              </li>
            </Link>
            <li>
              <button
                type="button"
                className="logout-mobile-btn"
                onClick={this.onClickLogout}
              >
                <img
                  src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
                  alt="logout icon"
                  className="logout-icon"
                />
              </button>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
