import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import './index.css'

const profileApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const jobsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypeArray = []

class Jobs extends Component {
  state = {
    profileApiStatus: profileApiStatusConstants.initial,
    jobsApiStatus: jobsApiStatusConstants.initial,
    profileData: [],
    jobsData: [],
    activeEmploymentType: '',
    activeMinimumPackage: '',
    activeSearchText: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({profileApiStatus: profileApiStatusConstants.inProgress})
    const profileUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileResponse = await fetch(profileUrl, options)
    if (profileResponse.ok) {
      const fetchedData = await profileResponse.json()
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }

      this.setState({
        profileApiStatus: profileApiStatusConstants.success,
        profileData: updatedData,
      })
    } else {
      this.setState({profileApiStatus: profileApiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: jobsApiStatusConstants.inProgress})
    const {
      activeEmploymentType,
      activeMinimumPackage,
      activeSearchText,
    } = this.state
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentType}&minimum_package=${activeMinimumPackage}&search=${activeSearchText}`
    const jwtToken = Cookies.get('jwt_token')
    const jobsOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const jobsResponse = await fetch(jobsUrl, jobsOptions)
    if (jobsResponse.ok) {
      const jobsFetchedData = await jobsResponse.json()

      const updatedJobsData = jobsFetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobsApiStatus: jobsApiStatusConstants.success,
        jobsData: updatedJobsData,
      })
    } else {
      this.setState({jobsApiStatus: jobsApiStatusConstants.failure})
    }
  }

  renderProfileSuccess = () => {
    const {profileData} = this.state
    return (
      <div className="profile-success-container">
        <img
          src={profileData.profileImageUrl}
          className="profile-image"
          alt="profileImage"
        />
        <h3 className="profile-heading">{profileData.name}</h3>
        <p className="profile-bio">{profileData.shortBio}</p>
      </div>
    )
  }

  renderProfileNotFound = () => (
    <div>
      <button type="button" onClick={this.getProfile}>
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllJobsView = () => {
    const {jobsData} = this.state

    return (
      <ul>
        {jobsData.map(each => (
          <Link to={`/jobs/${each.id}`}>
            <li className="job-container">
              <div className="logo-title-container">
                <img
                  src={each.companyLogoUrl}
                  alt="company logo"
                  className="companyLogo"
                />
                <div>
                  <h3>{each.title}</h3>
                  <p>{each.rating}</p>
                </div>
              </div>
              <div className="location-package-container">
                <div className="location-employment-container">
                  <p>{each.location}</p>
                  <p>{each.employmentType}</p>
                </div>
                <p>{each.packagePerAnnum}</p>
              </div>
              <br />
              <h3>Description</h3>
              <p>{each.jobDescription}</p>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  renderJobsData = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case jobsApiStatusConstants.success:
        return this.renderAllJobsView()
      case jobsApiStatusConstants.failure:
        return this.renderJobsFailureView()
      case jobsApiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  updateSearchText = event => {
    this.setState({activeSearchText: event.target.value})
  }

  addTypeIntoUrl = word => {
    employmentTypeArray.push(word)
    const addedEmploymentTypeString = employmentTypeArray.join(',')

    this.setState(
      {activeEmploymentType: addedEmploymentTypeString},
      this.getJobs,
    )
  }

  removeTypeFromUrl = word => {
    const index = employmentTypeArray.indexOf(word)
    if (index > -1) {
      employmentTypeArray.splice(index, 1)
    }
    const removedEmploymentTypeString = employmentTypeArray.join(',')

    this.setState(
      {activeEmploymentType: removedEmploymentTypeString},
      this.getJobs,
    )
  }

  checkInputStatus = event => {
    if (event.target.checked) {
      this.addTypeIntoUrl(event.target.id)
    } else {
      this.removeTypeFromUrl(event.target.id)
    }
  }

  checkSalaryRange = event => {
    this.setState({activeMinimumPackage: event.target.id}, this.getJobs)
  }

  renderNoJobsView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h2>No Jobs Found</h2>
      <p>We could not find any jobs. Try other filters.</p>
    </>
  )

  renderJobsFailureView = () => (
    <>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button type="button" onClick={this.getJobs}>
          Retry
        </button>
      </div>
    </>
  )

  render() {
    const {profileApiStatus, jobsData, jobsApiStatus} = this.state

    return (
      <div>
        <ul>
          <Header />
        </ul>
        <div className="jobs-total-container">
          <div className="profile-job-filters">
            <div className="profile-container">
              {profileApiStatus === 'SUCCESS'
                ? this.renderProfileSuccess()
                : this.renderProfileNotFound()}
            </div>

            <br className="br" />
            <div className="employment-type">
              <h2>Type of Employment</h2>
              <ul>
                {employmentTypesList.map(each => (
                  <li>
                    <input
                      type="checkbox"
                      id={each.employmentTypeId}
                      onClick={this.checkInputStatus}
                    />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <br className="br" />
            <div className="salary-range">
              <h2>Salary Range</h2>
              <ul>
                {salaryRangesList.map(each => (
                  <li>
                    <input
                      type="radio"
                      id={each.salaryRangeId}
                      name="salaryRange"
                      onClick={this.checkSalaryRange}
                    />
                    <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobs-container">
            <div>
              <input
                type="search"
                className="search-element"
                placeholder="Search"
                onChange={this.updateSearchText}
              />
              <button type="button" data-testid="searchButton">
                <AiOutlineSearch onClick={this.getJobs} />
              </button>
            </div>

            {jobsData.length < 1 && jobsApiStatus === 'SUCCESS'
              ? this.renderNoJobsView()
              : this.renderJobsData()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
