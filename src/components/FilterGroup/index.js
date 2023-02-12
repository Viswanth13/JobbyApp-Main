import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiResultsList = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
}

class FilterGroup extends Component {
  state = {
    profileDetails: {},
    apiStatus: apiResultsList.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const profileObject = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: profileObject,
        apiStatus: apiResultsList.success,
      })
    } else {
      this.setState({
        apiStatus: apiResultsList.failure,
      })
    }
  }

  employmentSelected = employmentTypeId => {
    const checkBoxEl = document.getElementById(employmentTypeId)
    const {addToEmploymentTypeList, removeFromEmploymentTypeList} = this.props

    if (checkBoxEl.checked) {
      addToEmploymentTypeList(employmentTypeId)
    } else {
      removeFromEmploymentTypeList(employmentTypeId)
    }
  }

  updateSalaryRange = salaryId => {
    const {updateSalaryRange} = this.props
    updateSalaryRange(salaryId)
  }

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button className="retry" type="button" onClick={this.getProfileDetails}>
        Retry
      </button>
    </div>
  )

  renderProfileLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiResultsList.success:
        return this.renderProfileSuccessView()
      case apiResultsList.inProgress:
        return this.renderProfileLoader()
      case apiResultsList.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  render() {
    const {employmentTypesList, salaryRangesList} = this.props

    return (
      <div className="total-filter-container">
        {this.renderProfile()}

        <hr className="break-line" />

        <h3>Type of Employment</h3>
        <ul type="none">
          {employmentTypesList.map(eachType => (
            <li
              key={eachType.employmentTypeId}
              onChange={() =>
                this.employmentSelected(eachType.employmentTypeId)
              }
            >
              <input
                type="checkbox"
                id={eachType.employmentTypeId}
                className="check-box"
              />
              <label htmlFor={eachType.employmentTypeId}>
                {eachType.label}
              </label>
            </li>
          ))}
        </ul>
        <hr className="break-line" />

        <h3>Salary Range</h3>
        <ul type="none">
          {salaryRangesList.map(eachRange => (
            <li
              key={eachRange.salaryRangeId}
              onChange={() => this.updateSalaryRange(eachRange.salaryRangeId)}
            >
              <input
                type="radio"
                className="check-box"
                id={eachRange.salaryRangeId}
                name="salary-ranges"
              />
              <label htmlFor={eachRange.salaryRangeId} label="label">
                {eachRange.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
export default FilterGroup
