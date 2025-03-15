import React from "react";
import { BarChartLine, BoxSeam } from "react-bootstrap-icons"; // Import icons
import aboutImage from "../assets/about.jpg"; // Updated image path
import "./Home.css";

const About = () => {
  return (
    <section id="about" className="about section light-background">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>About</h2>
        <p>
          <span>Find Out More</span>{" "}
          <span className="description-title">About InventoryPro</span>
        </p>
      </div>
      {/* End Section Title */}
      <div className="container">
        <div className="row gy-3">
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
            <img
              src={aboutImage} // Updated image path
              alt="Inventory Management"
              className="img-fluid"
            />
          </div>
          <div
            className="col-lg-6 d-flex flex-column justify-content-center"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="about-content ps-0 ps-lg-3">
              <h3>Efficient Inventory Management Made Simple</h3>
              <p className="fst-italic">
                InventoryPro helps you track, manage, and optimize your inventory effortlessly.
              </p>
              <ul>
                <li>
                  <div className="icon">
                    <BarChartLine size={48} className="text-primary" />
                  </div>
                  <div>
                    <h4>Streamlined Processes</h4>
                    <p>
                      Simplify inventory tracking and reduce errors with our seamless solutions.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <BoxSeam size={48} className="text-primary" />
                  </div>
                  <div>
                    <h4>Real-Time Insights</h4>
                    <p>
                      Get up-to-date data on inventory levels, enabling smarter business decisions.
                    </p>
                  </div>
                </li>
              </ul>
              <p>
                InventoryPro empowers your business with tools to optimize stock levels,
                eliminate wastage, and improve efficiency—allowing you to focus on growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
