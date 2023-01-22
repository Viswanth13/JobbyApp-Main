import {Component} from 'react'
import {Link} from 'react-router-dom'

import './index.css'

class SimilarJobItem extends Component {
  render() {
    const {eachSimilarJob} = this.props
    const {
      similarTitle,
      similarId,
      similarCompanyLogoUrl,
      similarEmploymentType,
      similarJobDescription,
      similarLocation,
      similarRating,
    } = eachSimilarJob
    console.log(eachSimilarJob)

    return (
      <>
        <Link to={`/jobs/${similarId}`}>
          <li className="each-similar-job-container">
            <div className="logo-title-container">
              <img
                src={similarCompanyLogoUrl}
                alt="similar job company logo"
                className="similar-logo-image"
              />
              <div>
                <h3>{similarTitle}</h3>
                <p>{similarRating}</p>
              </div>
            </div>
            <h2>Description</h2>
            <p>{similarJobDescription}</p>
            <div className="similar-location-emp-type-container">
              <p>{similarLocation}</p>
              <p>{similarEmploymentType}</p>
            </div>
          </li>
        </Link>
      </>
    )
  }
}

export default SimilarJobItem
