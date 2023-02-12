import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobItem from '../JobItem'
import FilterGroup from '../FilterGroup'
import './index.css'

const apiResultsList = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class Jobs extends Component {
  state = {
    userSearch: '',
    apiStatus: apiResultsList.initial,
    jobsList: [],
    salaryRange: '',
    empTypeList: [],
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({
      apiStatus: apiResultsList.inProgress,
    })

    const {userSearch, salaryRange, empTypeList} = this.state

    const empTypeString = empTypeList.join(',')

    const url = `https://apis.ccbp.in/jobs?search=${userSearch}&minimum_package=${salaryRange}&employment_type=${empTypeString}`
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
      const {jobs} = data

      const responseJobsList = jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        title: eachJob.title,
        rating: eachJob.rating,
      }))

      this.setState({
        apiStatus: apiResultsList.success,
        jobsList: responseJobsList,
      })
    } else {
      this.setState({
        apiStatus: apiResultsList.failure,
      })
    }
  }

  updateSearchValue = event => {
    this.setState({
      userSearch: event.target.value,
    })
  }

  updateApiUrl = () => {
    this.getJobs()
  }

  startSearch = event => {
    if (event.key === 'Enter') {
      this.updateApiUrl()
    }
  }

  updateSalaryRange = salaryId => {
    this.setState(
      {
        salaryRange: salaryId,
      },
      this.getJobs,
    )
  }

  addToEmploymentTypeList = employmentId => {
    const {empTypeList} = this.state
    empTypeList.push(employmentId)

    this.setState(
      {
        empTypeList,
      },
      this.getJobs,
    )
  }

  removeFromEmploymentTypeList = employmentId => {
    const {empTypeList} = this.state

    const index = empTypeList.indexOf(employmentId)
    empTypeList.pop(index)

    this.setState(
      {
        empTypeList,
      },
      this.getJobs,
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="not-if-list">
      <img
        className="no-jobs"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find you are looking for.</p>
      <button type="button" className="retry" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobsList} = this.state
    const anyJobs = jobsList.length > 0

    return anyJobs ? (
      <div>
        {jobsList.map(eachJob => (
          <Link
            key={eachJob.id}
            className="link-container"
            to={`jobs/${eachJob.id}`}
          >
            <JobItem jobDetails={eachJob} />
          </Link>
        ))}
      </div>
    ) : (
      <div className="not-if-list">
        <img
          className="no-jobs"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    )
  }

  renderDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiResultsList.success:
        return this.renderSuccessView()
      case apiResultsList.failure:
        return this.renderFailureView()
      case apiResultsList.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {employmentTypesList, salaryRangesList} = this.props
    const {userSearch} = this.state

    return (
      <>
        <Header />
        <div className="total-container">
          <div className="mobile-search">
            <input
              type="search"
              placeholder="Search"
              className="search-input"
              onChange={this.updateSearchValue}
              onKeyDown={this.startSearch}
              value={userSearch}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-button"
              onClick={this.updateApiUrl}
            >
              <BsSearch />
            </button>
          </div>
          <FilterGroup
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            updateSalaryRange={this.updateSalaryRange}
            addToEmploymentTypeList={this.addToEmploymentTypeList}
            removeFromEmploymentTypeList={this.removeFromEmploymentTypeList}
          />
          <div className="list-container">
            <div className="search-container">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                onChange={this.updateSearchValue}
                onKeyDown={this.startSearch}
                value={userSearch}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.updateApiUrl}
              >
                <BsSearch />
              </button>
            </div>
            <div className="jobs-container">{this.renderDetails()}</div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
