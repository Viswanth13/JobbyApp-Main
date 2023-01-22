import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {jobItemData: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props

    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      //   console.log(fetchedData)
      const updatedData = {
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        id: fetchedData.job_details.id,
        jobDescription: fetchedData.job_details.job_description,
        description: fetchedData.job_details.life_at_company.description,
        imageUrl: fetchedData.job_details.life_at_company.image_url,
        location: fetchedData.job_details.location,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
        rating: fetchedData.job_details.rating,
        skills: fetchedData.job_details.skills,
        title: fetchedData.job_details.title,
        similarJobs: fetchedData.similar_jobs,
      }
      console.log(updatedData)
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobItemData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobItemSuccessView = () => {
    const {jobItemData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      description,
      imageUrl,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
      similarJobs,
    } = jobItemData
    const updatedSimilarJobs = similarJobs.map(each => ({
      similarTitle: each.title,
      similarId: each.id,
      similarCompanyLogoUrl: each.company_logo_url,
      similarEmploymentType: each.employmentType,
      similarJobDescription: each.job_description,
      similarLocation: each.location,
      similarRating: each.rating,
    }))
    const updatedSkills = skills.map(each => ({
      skillImageUrl: each.image_url,
      skillName: each.name,
    }))

    return (
      <div className="job-details-total-container">
        <div className="job-details-container">
          <div className="logo-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="companyLogo"
            />
            <div>
              <h3>{title}</h3>
              <p>{rating}</p>
            </div>
          </div>
          <div className="location-package-container">
            <div className="location-employment-container">
              <p>{location}</p>
              <p>{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <br />
          <div className="description-skills-container">
            <div className="description-visit-container">
              <h2>Description</h2>
              <a href={companyWebsiteUrl}>Visit</a>
            </div>
            <p>{jobDescription}</p>
            <h3>Skills</h3>
            <ul className="skills-container">
              {updatedSkills.map(eachSkill => (
                <li className="each-skill">
                  <img
                    src={eachSkill.skillImageUrl}
                    alt={eachSkill.skillName}
                  />
                  <p>{eachSkill.skillName}</p>
                </li>
              ))}
            </ul>
            <h1>Life at Company</h1>
            <div className="description-company-pic-container">
              <p>{description}</p>
              <img
                src={imageUrl}
                alt="life at company"
                className="lifeAtCompany"
              />
            </div>
            <h1>Similar Jobs</h1>
            <ul>
              {updatedSimilarJobs.map(eachSimilarJob => (
                <SimilarJobItem
                  key={eachSimilarJob.similarId}
                  eachSimilarJob={eachSimilarJob}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderJobItemFailureView = () => (
    <>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button type="button" onClick={this.getJobDetails}>
          Retry
        </button>
      </div>
    </>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobItemFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <ul>
          <Header />
        </ul>
        {this.renderJobItemDetails()}
      </>
    )
  }
}

export default JobItemDetails
