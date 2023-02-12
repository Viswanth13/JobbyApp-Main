import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {HiExternalLink} from 'react-icons/hi'
import Header from '../Header'
import SimilarJob from '../SimilarJob'
import './index.css'

const apiResultsList = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class JobItemDetailed extends Component {
  state = {
    mainJobDetails: {},
    apiStatus: apiResultsList.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiResultsList.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const responseSkills = data.job_details.skills.map(eachSkill => ({
        name: eachSkill.name,
        imageUrl: eachSkill.image_url,
      }))

      const responseSimilarJobs = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        title: eachJob.title,
        rating: eachJob.rating,
      }))

      const responseJobDetails = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          jobDescription: data.job_details.job_description,
          location: data.job_details.location,
          skills: responseSkills,
          packagePerAnnum: data.job_details.package_per_annum,
          title: data.job_details.title,
          rating: data.job_details.rating,
        },
        similarJobs: responseSimilarJobs,
      }

      this.setState({
        mainJobDetails: responseJobDetails,
        apiStatus: apiResultsList.success,
      })
    } else {
      this.setState({
        apiStatus: apiResultsList.failure,
      })
    }
  }

  renderLoader = () => (
    <div className="non-detail-view-container">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  renderFailureView = () => (
    <div className="non-detail-view-container">
      <img
        className="no-jobs"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="retry" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {mainJobDetails} = this.state

    const {
      title,
      companyLogoUrl,
      employmentType,
      companyWebsiteUrl,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
    } = mainJobDetails.jobDetails

    return (
      <div className="detailed-bg-container">
        <div className="job-card">
          <div className="name-card">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-company-logo"
            />
            <div>
              <h1 className="job-title">{title}</h1>
              <div className="rating-card">
                <AiFillStar className="star" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details-container">
            <div className="rating-card">
              <IoLocationSharp className="symbol" />
              <p className="location-text">{location}</p>
              <BsFillBriefcaseFill className="symbol" />
              <p>{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="break-line" />
          <div className="job-details-container">
            <h1 className="description">Description</h1>
            <a href={companyWebsiteUrl}>
              Visit
              <HiExternalLink />
            </a>
          </div>
          <p>{jobDescription}</p>

          <h1 className="description">Skills</h1>
          <div className="skills-container">
            {mainJobDetails.jobDetails.skills.map(eachSkill => (
              <div className="each-skill-container" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-image"
                />
                <p>{eachSkill.name}</p>
              </div>
            ))}
          </div>
          <h1 className="description">Life at Company</h1>
          <div className="life-at-company">
            <p>{mainJobDetails.jobDetails.lifeAtCompany.description}</p>
            <img
              src={mainJobDetails.jobDetails.lifeAtCompany.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <div className="bottom-section">
          <h1>Similar Jobs</h1>
          <div className="sim-jobs-items-container" type="none">
            {mainJobDetails.similarJobs.map(eachJob => (
              <Link
                target="_blank"
                key={eachJob.id}
                className="link-container similar-job-con"
                to={`${eachJob.id}`}
              >
                <SimilarJob key={eachJob.id} jobDetails={eachJob} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  renderOptions = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiResultsList.success:
        return this.renderSuccessView()
      case apiResultsList.inProgress:
        return this.renderLoader()
      case apiResultsList.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderOptions()}
      </>
    )
  }
}
export default JobItemDetailed
