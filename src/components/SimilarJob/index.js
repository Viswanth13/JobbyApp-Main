import {Component} from 'react'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

class SimilarJob extends Component {
  render() {
    const {jobDetails} = this.props
    const {
      title,
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
    } = jobDetails
    return (
      <div className="similar-job-card">
        <div className="name-card">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
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

        <h1 className="description">Description</h1>
        <p>{jobDescription}</p>
        <div className="job-details-container">
          <div className="rating-card">
            <IoLocationSharp className="symbol" />
            <p className="location-text">{location}</p>
            <BsFillBriefcaseFill className="symbol" />
            <p>{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
      </div>
    )
  }
}

export default SimilarJob
